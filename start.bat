@echo off
echo ================================
echo Iniciando projeto...
echo ================================

:: BACKEND
echo Iniciando Django...
cd gestao_tatuagens
start cmd /k "python manage.py runserver"

:: FRONTEND
echo Iniciando React...
cd ..
cd frontend
start cmd /k "npm run dev"

echo ================================
echo Projeto iniciado!
echo ================================
pause