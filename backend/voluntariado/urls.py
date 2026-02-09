from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedaniaViewSet, PerfilViewSet, AnuncioViewSet, InscripcionViewSet, ComentarioViewSet, RegisterView, CurrentUserView
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'pedanias', PedaniaViewSet)
router.register(r'comentarios', ComentarioViewSet, basename='comentario')
router.register(r'anuncios', AnuncioViewSet, basename='anuncio')
router.register(r'inscripciones', InscripcionViewSet, basename='inscripcion')
router.register(r'perfiles', PerfilViewSet, basename='perfil')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token),
    path('register/', RegisterView.as_view()),
    path('me/', CurrentUserView.as_view()),
]       