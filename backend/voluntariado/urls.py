from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedaniaViewSet, PerfilViewSet, AnuncioViewSet, InscripcionViewSet, ComentarioViewSet

# ¿Qué hace urls.py? -> Define las rutas a la cual React llamará para obtener información.
# La r antes de las comillas -> es para que le diga a Python que no interprete las \ como caracteres de escape con \n o \t 
router = DefaultRouter()
router.register(r'pedanias', PedaniaViewSet)
router.register(r'comentarios', ComentarioViewSet)

router.register(r'anuncios', AnuncioViewSet, basename='anuncio')
router.register(r'inscripciones', InscripcionViewSet, basename='inscripcion')
router.register(r'perfiles', PerfilViewSet, basename='perfil')

urlpatterns = [
    path('', include(router.urls)),
]       