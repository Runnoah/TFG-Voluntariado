@echo off
title Iniciar VoluntadMazarron
echo ==========================================
echo   Iniciando Servidores de Voluntariado
echo ==========================================

:: Iniciar Backend
echo [+] Iniciando Backend (Django)...
start cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

:: Esperar un poco para que el backend arranque
timeout /t 3 /nobreak > nul

:: Iniciar Frontend
echo [+] Iniciando Frontend (Vite)...
start cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   ¡Todo en marcha! 
echo   Backend: http://127.0.0.1:8000
echo   Frontend: http://localhost:5173
echo ==========================================
echo Puedes cerrar esta ventana, los servidores seguirán en sus propias consolas.
pause
