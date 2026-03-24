@echo off
echo Iniciando Servidores...

echo --- Intentando iniciar Backend (Django) ---
cd backend
start cmd /k "IF EXIST venv\Scripts\activate.bat (call venv\Scripts\activate.bat) & python manage.py runserver 8080 || ""C:\Users\canci\AppData\Local\Programs\Python\Python312\python.exe"" manage.py runserver 8080 || echo ERROR: No se encuentra Python. Instala Python y asegúrate de añadirlo al PATH."

echo --- Iniciando Frontend (React/Vite) ---
cd ../frontend
start cmd /k "npm run dev"

echo.
echo Si el backend falla, revisa tu instalación de Python.
echo El frontend debería abrirse en http://localhost:5173
pause
