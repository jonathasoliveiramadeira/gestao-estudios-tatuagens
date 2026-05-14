import os
import subprocess
import sys

print("================================")
print("INICIANDO CONFIGURAÇÃO DO PROJETO")
print("================================")

# ==========================================
# CAMINHOS
# ==========================================
BASE_DIR = os.getcwd()

BACKEND_DIR = os.path.join(BASE_DIR, "gestao_tatuagens")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# ==========================================
# FUNÇÃO AUXILIAR
# ==========================================
def run_command(command, cwd=None):

    try:

        subprocess.run(
            command,
            cwd=cwd,
            shell=True,
            check=True
        )

    except subprocess.CalledProcessError as e:

        print(f"\nErro ao executar: {command}")
        print(e)

        sys.exit(1)

# ==========================================
# PASSO 1 - VERIFICAR PYTHON
# ==========================================
print("\n[1/5] Verificando Python...")

try:

    subprocess.run(
        "python --version",
        shell=True,
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    print("Python encontrado.")

except:

    print("Python não encontrado.")
    print("Instalando Python via winget...")

    run_command("winget install Python.Python.3.14")

    print("\nPython instalado.")
    print("Feche e abra o terminal novamente.")

    sys.exit()

# ==========================================
# PASSO 2 - INSTALAR DEPENDÊNCIAS BACKEND
# ==========================================
print("\n[2/5] Instalando dependências do backend...")

requirements_path = os.path.join(BACKEND_DIR, "requirements.txt")

if os.path.exists(requirements_path):

    run_command(
        "pip install -r requirements.txt",
        cwd=BACKEND_DIR
    )

    print("Dependências do backend instaladas.")

else:

    print("requirements.txt não encontrado.")

# ==========================================
# PASSO 3 - VERIFICAR BANCO DE DADOS
# ==========================================
print("\n[3/5] Verificando banco de dados...")

db_path = os.path.join(BACKEND_DIR, "db.sqlite3")

if not os.path.exists(db_path):

    print("Banco não encontrado.")
    print("Executando migrations...")

    run_command(
        "python manage.py makemigrations",
        cwd=BACKEND_DIR
    )

    run_command(
        "python manage.py migrate",
        cwd=BACKEND_DIR
    )

    print("Banco criado com sucesso.")

else:

    print("Banco já existente.")

# ==========================================
# CRIAR SUPERUSER AUTOMÁTICO
# ==========================================
print("\nVerificando superuser...")

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

# ==========================================
# PASSO 4 - FRONTEND
# ==========================================
print("\n[4/5] Verificando frontend...")

node_modules = os.path.join(FRONTEND_DIR, "node_modules")

if not os.path.exists(node_modules):

    print("Dependências do React não encontradas.")
    print("Instalando...")

    run_command(
        "npm install",
        cwd=FRONTEND_DIR
    )

    print("Dependências do frontend instaladas.")

else:

    print("Frontend já configurado.")

# ==========================================
# PASSO 5 - INICIAR SERVIDORES
# ==========================================
print("\n[5/5] Iniciando servidores...")

# ==========================================
# DJANGO
# ==========================================
print("Iniciando Django...")

subprocess.Popen(
    'start cmd /k "python manage.py runserver"',
    cwd=BACKEND_DIR,
    shell=True
)

# ==========================================
# REACT
# ==========================================
print("Iniciando React/Vite...")

subprocess.Popen(
    'start cmd /k "npm run dev"',
    cwd=FRONTEND_DIR,
    shell=True
)

print("\n================================")
print("PROJETO INICIADO COM SUCESSO!")
print("================================")