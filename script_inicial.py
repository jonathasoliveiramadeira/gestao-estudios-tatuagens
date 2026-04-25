import os
import subprocess

print("================================")
print("Iniciando projeto...")
print("================================")

# Caminhos
BASE_DIR = os.getcwd()
BACKEND_DIR = os.path.join(BASE_DIR, "gestao_tatuagens")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# ================================
# CRIAR SUPERUSER AUTOMÁTICO
# ================================
print("Verificando superuser...")

env = os.environ.copy()
env["DJANGO_SUPERUSER_EMAIL"] = "admin@email.com"
env["DJANGO_SUPERUSER_PASSWORD"] = "123456"
env["DJANGO_SUPERUSER_TIPO_USUARIO"] = "admin"

try:
    subprocess.run(
        "python manage.py createsuperuser --noinput",
        cwd=BACKEND_DIR,
        shell=True,
        env=env
    )
    print("Superuser criado (ou já existente).")
except Exception as e:
    print("Erro ao criar superuser:", e)

# ================================
# BACKEND
# ================================
print("Iniciando Django...")

subprocess.Popen(
    'start cmd /k "python manage.py runserver"',
    cwd=BACKEND_DIR,
    shell=True
)

# ================================
# FRONTEND
# ================================
print("Iniciando React...")

subprocess.Popen(
    'start cmd /k "npm run dev"',
    cwd=FRONTEND_DIR,
    shell=True
)

print("================================")
print("Projeto iniciado com sucesso!")
print("================================")