variable "aws_region" {
  description = "Región de AWS donde se crea la infraestructura"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "Bloque CIDR de la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Bloque CIDR de la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "Bloque CIDR de la subred privada"
  type        = string
  default     = "10.0.2.0/24"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t3.micro" # elegible para free tier
}

variable "key_name" {
  description = "Nombre del key pair SSH en AWS"
  type        = string
  default     = "portfolio-key"
}

variable "admin_cidr" {
  description = "CIDR desde el que se permite SSH (tu IP pública /32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "common_tags" {
  description = "Tags comunes de todos los recursos"
  type        = map(string)
  default = {
    Project     = "portafolio-personal"
    ManagedBy   = "terraform"
    Environment = "production"
  }
}
