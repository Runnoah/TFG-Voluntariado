from rest_framework import viewsets, permissions
from .models import Pedania, Anuncio, Inscripcion, Comentario, Perfil
from .serializers import PedaniaSerializer, AnuncioSerializer, InscripcionSerializer, ComentarioSerializer, PerfilSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

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
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Comentario.objects.all()
        anuncio_id = self.request.query_params.get('anuncio')
        if anuncio_id is not None:
            queryset = queryset.filter(anuncio=anuncio_id)
        return queryset

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

from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()
            # Crear perfil automáticamente
            Perfil.objects.create(user=user, rol='Voluntario') 
            
            # Generar token real
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Asegurar que existe el perfil (por si acaso son usuarios antiguos)
        perfil, created = Perfil.objects.get_or_create(user=request.user)
        serializer = PerfilSerializer(perfil, context={'request': request})
        return Response(serializer.data)

    def put(self, request):
        perfil, created = Perfil.objects.get_or_create(user=request.user)
        user = request.user
        data = request.data

        # 1. Actualizar datos del Usuario
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'email' in data: user.email = data['email']
        user.save()

        # 2. Actualizar datos del Perfil
        # Usamos el serializer para validar y guardar (partial=True permite enviar solo algunos campos)
        serializer = PerfilSerializer(perfil, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            # Retornamos los datos actualizados
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)