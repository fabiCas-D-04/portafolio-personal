#!/usr/bin/env bash
# ============================================================
# Configuración de la VM del portafolio (Ubuntu 24.04)
# Alternativa en bash al playbook de Ansible (ansible/playbook.yml).
# Instala Docker + Compose, Git, firewall (UFW) e iptables
# con los puertos 80 y 443 abiertos.
#
# Uso:  sudo bash scripts/setup.sh
# ============================================================
set -euo pipefail

echo "==> Actualizando paquetes"
apt-get update -y

echo "==> Instalando paquetes base (git, curl, ufw, iptables)"
apt-get install -y ca-certificates curl gnupg git ufw iptables iptables-persistent

echo "==> Instalando Docker Engine + Compose plugin"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

CODENAME="$(. /etc/os-release && echo "${VERSION_CODENAME}")"
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "==> Habilitando Docker"
systemctl enable --now docker
usermod -aG docker ubuntu || true

echo "==> Configurando firewall (UFW): 22, 80 y 443"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> Abriendo puertos 80 y 443 en iptables (idempotente)"
for port in 80 443; do
  iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null \
    || iptables -A INPUT -p tcp --dport "$port" -j ACCEPT
done
mkdir -p /etc/iptables
iptables-save > /etc/iptables/rules.v4

echo "==> Verificando instalación"
git --version
docker --version
docker compose version
ufw status verbose
iptables -L INPUT -n | grep -E ':80|:443' || true

echo "==> VM configurada correctamente"
