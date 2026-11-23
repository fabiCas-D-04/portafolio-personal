output "public_ip" {
  description = "IP pública de la VM (la usa el pipeline de Ansible)"
  value       = aws_eip.web.public_ip
}

output "private_key_pem" {
  description = "Clave privada SSH generada para acceder a la VM (sensible)"
  value       = tls_private_key.portfolio.private_key_pem
  sensitive   = true
}

output "ssh_command" {
  description = "Comando para conectarte a la VM"
  value       = "ssh -i ~/.ssh/portfolio-key.pem ubuntu@${aws_eip.web.public_ip}"
}

output "vpc_id" {
  description = "ID de la VPC"
  value       = aws_vpc.portfolio.id
}

output "public_subnet_id" {
  description = "ID de la subred pública"
  value       = aws_subnet.public.id
}

output "private_subnet_id" {
  description = "ID de la subred privada"
  value       = aws_subnet.private.id
}

output "instance_id" {
  description = "ID de la instancia EC2"
  value       = aws_instance.web.id
}
