# 📁 Práctica 3.2 – Portafolio Personal

Portafolio personal desarrollado con **frontend, backend y base de datos**, empaquetado en
**Docker**, con infraestructura como código (**Terraform**), configuración de servidor con
**Ansible** y un **pipeline en GitHub Actions** con tests automatizados.

---

## 🧱 Stack tecnológico

| Capa       | Tecnología                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18 + Vite + React Router      |
| Backend    | Node.js + Express + Mongoose        |
| Base de datos | MongoDB 7                        |
| Tests      | Jest + Supertest, Vitest + Testing Library, Playwright |
| Contenedores | Docker + Docker Compose + nginx   |
| CI/CD      | GitHub Actions                      |
| Infraestructura | Terraform (AWS: VPC, subredes, EC2 Ubuntu 24.04, IP pública) |
| Configuración | Ansible (+ `scripts/setup.sh` alternativo) |
| Dominio    | Cloudflare (opcional, 30 pts extra) |

---

## 📂 Estructura del proyecto

```
3.2/
├── .github/workflows/
│   ├── tests.yml          # Tests reutilizables (workflow_call)
│   ├── dev.yml            # DEV: cada push ejecuta los tests
│   └── main.yml           # MAIN: tests + Docker + Terraform + Ansible + Cloudflare
├── frontend/              # React (Vite)
│   ├── src/               # Páginas, componentes, servicios y utilidades
│   ├── src/**/*.test.jsx  # Tests unitarios (Vitest)
│   ├── e2e/               # Tests E2E (Playwright)
│   ├── Dockerfile         # Build + nginx
│   └── nginx.conf         # Proxy /api -> backend y SPA routing
├── backend/               # Express + MongoDB
│   ├── src/               # app, rutas, controladores, modelos, utilidades
│   └── tests/
│       ├── unit/          # Tests unitarios (Jest)
│       └── integration/   # Tests de integración (Supertest)
├── terraform/             # VPC + 2 subredes + SG + EC2 Ubuntu 24.04 + IP pública
├── ansible/               # Playbook: docker, git, firewall, iptables (80/443) + deploy
├── scripts/setup.sh       # Alternativa en bash al playbook de Ansible
├── docker-compose.yml     # mongo + backend + frontend
└── README.md
```

---

## 🧪 Tests (mínimo 3 de cada tipo)

| Tipo         | Herramienta                         | Dónde                                   | Cantidad |
| ------------ | ----------------------------------- | --------------------------------------- | -------- |
| **Unitarios** | Jest (backend) + Vitest (frontend) | `backend/tests/unit`, `frontend/src/**/*.test.jsx` | 18+ |
| **Integración** | Supertest contra la API           | `backend/tests/integration/api.test.js` | 10 |
| **E2E**      | Playwright                          | `frontend/e2e/*.spec.js`                | 9        |

### Ejecutar los tests en local

```bash
# Backend (unitarios + integración) — no necesita MongoDB instalado:
# si no hay MONGODB_URI usa un MongoDB en memoria (mongodb-memory-server)
cd backend && npm ci && npm test

# Frontend unitarios
cd frontend && npm ci && npm test

# Frontend E2E (levanta backend y frontend automáticamente)
cd frontend && npx playwright install --with-deps chromium
npm run test:e2e
```

---

## 🚀 Ejecutar el proyecto en local

```bash
# 1) Backend  -> http://localhost:4000
cd backend && npm ci && npm run dev

# 2) Frontend -> http://localhost:5173  (hace proxy de /api al backend)
cd frontend && npm ci && npm run dev
```

O con Docker (todo junto):

```bash
docker compose up --build
# Frontend: http://localhost  |  API: http://localhost/api/health
```

---

## ⚙️ Pipeline de GitHub Actions

### Rama `dev` → `.github/workflows/dev.yml`
Cada **push a `dev`** ejecuta automáticamente:
1. Tests unitarios del backend (Jest)
2. Tests de integración (Supertest + MongoDB en memoria)
3. Tests unitarios del frontend (Vitest) + build de producción
4. Tests E2E (Playwright)

### Rama `main` → `.github/workflows/main.yml`
Cada **push a `main`** ejecuta, en orden:

1. **Tests** (los mismos que en `dev`)
2. **Docker**: construye `portfolio-backend` y `portfolio-frontend` y los publica en **DockerHub**
3. **Terraform**: crea/actualiza en **AWS**
   - VPC + subred pública y privada + Internet Gateway
   - Security Group (22, 80, 443)
   - EC2 **Ubuntu 24.04 LTS** con **IP pública** (EIP) y par de claves SSH generado
4. **Ansible**: conecta por SSH a la VM y configura
   - **Docker + Docker Compose** (repo oficial)
   - **Git**
   - **Firewall (UFW)**: 22/80/443
   - **iptables**: reglas para los puertos **80 y 443** (persistidas)
   - Despliega el `docker-compose.yml` (mongo + backend + frontend)
5. **Cloudflare** *(extra)*: crea/actualiza el registro **A** de tu dominio apuntando a la VM

---

## 🔐 Secrets y variables a configurar en GitHub

**Settings → Secrets and variables → Actions**

### Secrets (obligatorios)

| Secret               | Descripción                                              |
| -------------------- | -------------------------------------------------------- |
| `DOCKERHUB_USERNAME` | Tu usuario de DockerHub                                  |
| `DOCKERHUB_TOKEN`    | Personal Access Token de DockerHub (scope: write)        |
| `AWS_ACCESS_KEY_ID`  | Clave de acceso de AWS (IAM con permisos EC2/VPC)        |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta de AWS                                   |

### Variables (Settings → Secrets and variables → Actions → pestaña **Variables**)

| Variable            | Descripción                                                     |
| ------------------- | --------------------------------------------------------------- |
| `AWS_REGION`        | Región de AWS (por defecto `us-east-1`)                          |
| `CLOUDFLARE_DOMAIN` | Dominio, por ejemplo `portafolio.tudominio.com` (extra)          |

### Secrets opcionales (extra – Cloudflare 30 pts)

| Secret               | Descripción                                    |
| -------------------- | ---------------------------------------------- |
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare (permiso DNS:Edit) |
| `CLOUDFLARE_ZONE_ID`   | ID de la zona del dominio                     |

> Si no configuras los secrets de Cloudflare, ese paso se omite automáticamente y el resto del
> pipeline funciona igual.

---

## 📦 Primeros pasos (desde cero)

```bash
# 1) Entrar a la carpeta del proyecto
cd "D:\3er año 2\proyecto de sistemas 3\3.2"

# 2) Inicializar git y crear las ramas
git init
git add .
git commit -m "feat: portafolio personal con pipeline CI/CD"
git branch -M main
git checkout -b dev

# 3) Crear el repo en GitHub (vacío) y subir las ramas
git remote add origin https://github.com/TU-USUARIO/PORTAFOLIO.git
git push -u origin dev

# 4) Trabajar en dev, y cuando esté listo pasar a main:
git checkout main
git merge dev
git push -u origin main     # ← dispara Docker + Terraform + Ansible
```

### Configuración de AWS (una sola vez)

```bash
# Usuario IAM con políticas AmazonEC2FullAccess (o Least Privilege)
aws configure
```

### Terraform en local (opcional)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # ajusta región/admin_cidr
terraform init
terraform plan
terraform apply
terraform output -raw public_ip
terraform output -raw private_key_pem > ~/.ssh/portfolio-key.pem
chmod 600 ~/.ssh/portfolio-key.pem
ssh -i ~/.ssh/portfolio-key.pem ubuntu@<IP_PUBLICA>
```

### Ansible en local (opcional)

```bash
cd ansible
cp inventory.example.ini inventory.ini   # pon la IP pública
ansible-playbook -i inventory.ini playbook.yml \
  --extra-vars "DOCKERHUB_USERNAME=tu-usuario"
```

Alternativa sin Ansible: `sudo bash scripts/setup.sh` dentro de la VM.

---

## 🌐 Cloudflare (30 pts extra)

1. Añade tu dominio a Cloudflare (plan free).
2. Crea un **API Token** con permiso `Zone → DNS → Edit`.
3. Copia el **Zone ID** desde el panel del dominio.
4. Configura en GitHub:
   - Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`
   - Variable: `CLOUDFLARE_DOMAIN` (ej. `portafolio.tudominio.com`)
5. En el siguiente push a `main`, el pipeline creará el registro **A** apuntando a la VM.

---

## 📊 Mapa de requisitos de la práctica

| Requisito | Dónde se cumple |
| --------- | --------------- |
| Pipeline `.yml` en GitHub Actions | `.github/workflows/*.yml` |
| DEV: tests en cada push | `dev.yml` → `tests.yml` |
| Frameworks frontend, backend y BD | React / Express / MongoDB |
| ≥3 tests unitarios, integración y E2E | `backend/tests`, `frontend/src/**/*.test.jsx`, `frontend/e2e` |
| MAIN: Docker + DockerHub | `main.yml` job `docker` |
| Terraform: VM Ubuntu 24.04, VPC, subredes, IP pública | `terraform/` |
| Script/Ansible: docker, git, firewall, iptables 80/443 | `ansible/playbook.yml` y `scripts/setup.sh` |
| **Extra:** Ansible | `ansible/playbook.yml` |
| **Extra:** Cloudflare | `main.yml` job `cloudflare-dns` |
