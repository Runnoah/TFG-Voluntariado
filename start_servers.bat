@echo off
REM ===========================================================================
REM Script para iniciar los servidores de Backend (Django) y Frontend (React/Vite)
REM ===========================================================================

REM -- Establece la ruta base del proyecto como el directorio donde esta este archivo .bat
REM    %~dp0 siempre apunta a la carpeta donde se encuentra el script, sin importar
REM    desde donde se ejecute. Esto evita errores de "ruta no encontrada".
set "PROJECT_ROOT=%~dp0"

REM -- Muestra un mensaje inicial al usuario
echo.
echo ============================================
echo   Iniciando Servidores del Proyecto TFG
echo ============================================
echo.

REM ---------------------------------------------------------------------------
REM  BACKEND (Django) - Se ejecuta en el puerto 8080
REM ---------------------------------------------------------------------------

REM -- Construye la ruta completa a la carpeta del backend
set "BACKEND_DIR=%PROJECT_ROOT%backend"

REM -- Verifica que la carpeta del backend exista antes de intentar arrancarlo
if not exist "%BACKEND_DIR%\manage.py" (
    echo [ERROR] No se encontro manage.py en: %BACKEND_DIR%
    echo         Asegurate de que la carpeta 'backend' contiene el proyecto Django.
    goto :frontend
)

echo [1/2] Iniciando Backend Django en http://127.0.0.1:8080 ...

REM -- Comprueba si existe un entorno virtual (venv) en la carpeta del backend.
REM    Si existe, lo activa antes de ejecutar Django para usar las dependencias
REM    instaladas localmente. Si no existe, intenta usar el Python del sistema.
if exist "%BACKEND_DIR%\venv\Scripts\activate.bat" (
    REM -- Abre una nueva ventana de terminal que:
    REM    1. Se posiciona en la carpeta del backend con /d (cambia de unidad si es necesario)
    REM    2. Activa el entorno virtual con 'call' (necesario para que .bat no cierre la ventana)
    REM    3. Ejecuta el servidor Django en el puerto 8080
    start "Backend Django" cmd /k "cd /d "%BACKEND_DIR%" && call venv\Scripts\activate.bat && python manage.py runserver 8080"
) else (
    REM -- Si no hay entorno virtual, usa Python directamente del PATH del sistema
    echo [AVISO] No se encontro entorno virtual (venv). Usando Python del sistema...
    start "Backend Django" cmd /k "cd /d "%BACKEND_DIR%" && python manage.py runserver 8080"
)

REM ---------------------------------------------------------------------------
REM  FRONTEND (React/Vite) - Se ejecuta en el puerto 5173 por defecto
REM ---------------------------------------------------------------------------
:frontend

REM -- Construye la ruta completa a la carpeta del frontend
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

REM -- Verifica que la carpeta del frontend exista y tenga package.json
if not exist "%FRONTEND_DIR%\package.json" (
    echo [ERROR] No se encontro package.json en: %FRONTEND_DIR%
    echo         Asegurate de que la carpeta 'frontend' contiene el proyecto React.
    goto :end
)

echo [2/2] Iniciando Frontend React en http://localhost:5173 ...

REM -- Verifica que node_modules exista; si no, avisa al usuario que debe instalar dependencias
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [AVISO] No se encontro 'node_modules'. Ejecutando 'npm install' primero...
    start "Frontend React" cmd /k "cd /d "%FRONTEND_DIR%" && npm install && npm run dev"
) else (
    REM -- Abre una nueva ventana de terminal que:
    REM    1. Se posiciona en la carpeta del frontend
    REM    2. Ejecuta 'npm run dev' que arranca Vite en modo desarrollo
    start "Frontend React" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"
)

REM ---------------------------------------------------------------------------
REM  MENSAJE FINAL
REM ---------------------------------------------------------------------------
:end
echo.
echo ============================================
echo   Servidores iniciados correctamente
echo ============================================
echo.
echo   Backend  (Django): http://127.0.0.1:8080
echo   Frontend (React):  http://localhost:5173
echo.
echo   Cada servidor se ejecuta en su propia ventana.
echo   Para detenerlos, cierra las ventanas o pulsa Ctrl+C en cada una.
echo.
pause
