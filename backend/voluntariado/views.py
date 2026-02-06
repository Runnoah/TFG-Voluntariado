from rest_framework import viewsets, permissions
from .models import Pedania, Anuncio, Inscripcion, Comentario, Perfil
from .serializers import PedaniaSerializer, AnuncioSerializer, InscripcionSerializer, ComentarioSerializer, PerfilSerializer

# R-> viewsets -> Nos crea automaticamente el get / post / get id / put / delete 
# R-> IsAuthenticatedOrReadOnly -> Si vienes con Get | Pasa -> Si vienes con Post | No, registrate
class PedaniaViewSet(viewsets.ModelViewSet):
    queryset = Pedania.objects.all()
    serializer_class = PedaniaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# R-> Cualquiera ve anuncios pero solo las organizaciones/admin crean
class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class InscripcionViewSet(viewsets.ModelViewSet):
    serializer_class = InscripcionSerializer
    permission_classes = [permissions.IsAuthenticated]

    # R-> Carga TODOS los anuncios y permite que segun la pedania cargue solo les de esa pedania
    # R -> Cuando alguien envia el form Django lo intercepta.
    # Coge al usuario que este logueado  y lo pone en el campo "usuario" del modelo
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Inscripcion.objects.all()
        return Inscripcion.objects.filter(usuario=user)


    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios registrados ven perfiles

    def get_queryset(self):
        # Opcional: Que cada uno vea solo su perfil, o admin vea todos
        user = self.request.user
        if user.is_staff:
            return Perfil.objects.all()
        return Perfil.objects.filter(user=user)