# Instrucciones de Configuración y Ejecución

Este documento describe cómo levantar el proyecto (Backend y Frontend).

## 1. Backend (Django)

**Ubicación:** `/backend`

### Configuración (Primera vez)
1. **Crear entorno virtual**:
   ```bash
   python -m venv venv
   ```
2. **Activar entorno virtual (Windows)**:
   ```bash
   .\venv\Scripts\activate
   ```
3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```
   *(Nota: Se incluye `python-dotenv` para las variables de entorno)*

### Ejecutar Servidor
Para iniciar el servidor de desarrollo:
```bash
python manage.py runserver
```

**URL:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 2. Frontend (React/Vite)

**Ubicación:** `/frontend`

### Configuración (Primera vez)
1. **Instalar dependencias**:
   ```bash
   npm install
   ```

### Ejecutar Servidor
Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

**URL:** [http://localhost:5173/](http://localhost:5173/)

---

## Notas Adicionales
- Asegúrate de tener **Python** y **Node.js** instalados.
- Si encuentras errores de "módulo no encontrado" en el backend, verifica que el entorno virtual esté activado (`(venv)` debe aparecer en la terminal).
