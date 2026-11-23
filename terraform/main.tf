# ============================================================
# Portafolio personal - Infraestructura en AWS (IaC)
# VPC + 2 subredes + security group + EC2 Ubuntu 24.04 + IP pública
# ============================================================

data "aws_caller_identity" "current" {}

# AMI oficial de Ubuntu 24.04 LTS (Noble) de Canonical
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ---------------------------- VPC ----------------------------
resource "aws_vpc" "portfolio" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "portfolio-vpc"
  }
}

# -------------------------- Subredes -------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.portfolio.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = false

  tags = {
    Name = "portfolio-public-subnet"
    Tier = "public"
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.portfolio.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = "${var.aws_region}a"

  tags = {
    Name = "portfolio-private-subnet"
    Tier = "private"
  }
}

# --------------------- Internet Gateway ----------------------
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.portfolio.id

  tags = {
    Name = "portfolio-igw"
  }
}

# -------------------- Tabla de rutas -------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.portfolio.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "portfolio-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# -------------------- Security Group -------------------------
resource "aws_security_group" "web" {
  name        = "portfolio-web-sg"
  description = "HTTP, HTTPS y SSH hacia la VM del portafolio"
  vpc_id      = aws_vpc.portfolio.id

  # SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  # HTTP
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "portfolio-web-sg"
  }
}

# --------------- Par de claves SSH (generado) ----------------
resource "tls_private_key" "portfolio" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "portfolio" {
  key_name   = var.key_name
  public_key = tls_private_key.portfolio.public_key_openssh
}

# ------------------------- EC2 -------------------------------
resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  key_name                    = aws_key_pair.portfolio.key_name
  vpc_security_group_ids      = [aws_security_group.web.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  metadata_options {
    http_tokens = "required"
  }

  tags = {
    Name = "portfolio-vm-ubuntu-2404"
  }
}

# IP pública elástica (se mantiene aunque se reinicie la instancia)
resource "aws_eip" "web" {
  domain   = "vpc"
  instance = aws_instance.web.id

  tags = {
    Name = "portfolio-public-ip"
  }
}
