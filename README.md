# 🎨 Gestão de Tatuagens

Sistema web desenvolvido para gerenciamento de estúdios de tatuagem, permitindo cadastro de usuários, serviços, agendamentos e avaliações.

---

## 📌 Sobre o Projeto

O **Gestão de Tatuagens** é uma aplicação que conecta **tatuadores** e **clientes**, facilitando:

* Cadastro de usuários com diferentes perfis
* Gerenciamento de serviços oferecidos por tatuadores
* Agendamento de sessões
* Avaliação dos serviços realizados

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC), com foco em boas práticas de desenvolvimento web.

---

## 🚀 Funcionalidades

### 👤 Usuários

* Cadastro e autenticação
* Diferenciação entre:

  * Tatuador
  * Cliente

### 🖋️ Tatuador

* Cadastro de estúdio
* Upload de logotipo
* Descrição profissional
* Gerenciamento de serviços

### 🛍️ Serviços

* Criação e edição de serviços
* Definição de preço e duração

### 📅 Agendamentos

* Agendamento entre cliente e tatuador
* Controle de status:

  * Pendente
  * Confirmado
  * Cancelado
  * Concluído

### ⭐ Avaliações

* Avaliação após serviço concluído
* Nota e comentário
* Controle de integridade (1 avaliação por agendamento)

---

## 🏗️ Arquitetura do Projeto

O sistema foi desenvolvido utilizando o padrão **MVC (Model-View-Controller)** do Django.

### 📂 Estrutura

```
gestao_tatuagens/
│
├── app_gestao_tatuagens/
│   ├── models/
│   │   ├── usuario.py
│   │   ├── tatuador.py
│   │   ├── cliente.py
│   │   ├── servico.py
│   │   ├── agendamento.py
│   │   └── avaliacao.py
│   │
│   ├── enum/
│   │   └── tipo_usuario.py
│   │
│   ├── admin.py
│   ├── views.py
│   └── urls.py
│
├── gestao_tatuagens/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── manage.py
```

---

## 🧠 Modelagem

### 🔹 Usuario

* Baseado em `AbstractUser`
* Autenticação via email
* Campo de tipo de usuário

### 🔹 Tatuador

* Extensão de usuário (OneToOne)
* Informações do estúdio

### 🔹 Cliente

* Extensão de usuário (OneToOne)

### 🔹 Serviço

* Relacionado ao tatuador
* Contém preço e duração

### 🔹 Agendamento

* Relaciona cliente, tatuador e serviço
* Controle de status

### 🔹 Avaliação

* Relacionada ao agendamento
* Garante 1 avaliação por serviço

---

## 🛠️ Tecnologias Utilizadas

* Python 3.12
* Django 5
* SQLite (ambiente de desenvolvimento)
* Pillow (upload de imagens)
* Git / GitHub

---

## ⚙️ Configuração do Projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/jonathasoliveiramadeira/gestao-estudios-tatuagens.git
cd gestao_tatuagens
```

---

### 2️⃣ Criar ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate
```

---

### 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

Ou manualmente:

```bash
pip install django pillow
```

---

### 4️⃣ Aplicar migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### 5️⃣ Criar superusuário

```bash
python manage.py createsuperuser
```

---

### 6️⃣ Rodar o servidor

```bash
python manage.py runserver
```

Acesse:

```
http://127.0.0.1:8000/
http://127.0.0.1:8000/admin/
```

---

## 🔐 Configurações Importantes

No `settings.py`:

```python
AUTH_USER_MODEL = 'app_gestao_tatuagens.Usuario'
```

---

## 📸 Upload de Imagens

Certifique-se de configurar:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

---

## 🧪 Regras de Negócio

* Um usuário pode ser apenas:

  * Tatuador **ou**
  * Cliente

* Um tatuador pode ter vários serviços

* Um agendamento:

  * pertence a um cliente
  * pertence a um tatuador
  * está ligado a um serviço

* Uma avaliação:

  * só pode ocorrer após conclusão
  * é única por agendamento

---

## 📈 Melhorias Futuras

* Integração com frontend (React)
* Sistema de autenticação JWT
* Agenda inteligente (bloqueio de horários)
* Notificações
* Upload de portfólio de tatuagens
* Sistema de favoritos

---

## 👨‍💻 Autor

Desenvolvido por **Jonathas Madeira**

---

## 📄 Licença

Este projeto é de uso acadêmico.
