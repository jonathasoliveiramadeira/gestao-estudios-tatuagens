from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-CHANGE-THIS'

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]


# =========================
# APPS
# =========================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # obrigatório
    'django.contrib.sites',

    # terceiros
    'corsheaders',
    'rest_framework',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'django_rest_passwordreset',

    # app
    'app_gestao_tatuagens',
]

SITE_ID = 1


# =========================
# MIDDLEWARE
# =========================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =========================
# CORS / COOKIES (CRÍTICO)
# =========================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

# ⚠️ REMOVIDO (isso quebrava tudo)
# CORS_ALLOW_ALL_ORIGINS = True


SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False


# =========================
# URLS / TEMPLATES
# =========================
ROOT_URLCONF = 'gestao_tatuagens.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',  # IMPORTANTE
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'gestao_tatuagens.wsgi.application'


# =========================
# DATABASE
# =========================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# =========================
# AUTH
# =========================
AUTH_USER_MODEL = 'app_gestao_tatuagens.Usuario'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]


# =========================
# ALLAUTH (ATUALIZADO)
# =========================
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']

ACCOUNT_EMAIL_VERIFICATION = "none"

SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_QUERY_EMAIL = True


# =========================
# REDIRECTS
# =========================
LOGIN_REDIRECT_URL = "http://localhost:5173"
LOGOUT_REDIRECT_URL = "http://localhost:5173"


# =========================
# EMAIL
# =========================
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# =========================
# STATIC
# =========================
STATIC_URL = 'static/'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SOCIALACCOUNT_ADAPTER = 'app_gestao_tatuagens.adapters.CustomSocialAccountAdapter'
