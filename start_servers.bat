@echo off
echo Iniciando Servidores...

echo --- Intentando iniciar Backend (Django) ---
cd backend
start cmd /k ""C:\Users\canci\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver || py manage.py runserver || python manage.py runserver || echo ERROR: No se encuentra Python. Instala Python y asegúrate de añadirlo al PATH."

echo --- Iniciando Frontend (React/Vite) ---
cd ../frontend
start cmd /k "npm run dev"

echo.
echo Si el backend falla, revisa tu instalación de Python.
echo El frontend debería abrirse en http://localhost:5173
pause
