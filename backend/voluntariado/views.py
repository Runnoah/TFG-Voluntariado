from rest_framework import viewsets
from .models import Pedania, Perfil, Anuncio, Inscripcion, Comentario
from .serializers import PedaniaSerializer, PerfilSerializer, AnuncioSerializer, InscripcionSerializer, ComentarioSerializer    

# ¿Qué hace views? -> Recibe la orden de la web, consulta la base de datos y decide que datos enviar de vuelta.

class PedaniaViewSet(viewsets.ModelViewSet):
    queryset = Pedania.objects.all()
    serializer_class = PedaniaSerializer

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer

class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer

class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer