from rest_framework import viewsets, permissions
from .models import Pedania, Anuncio, Inscripcion, Comentario, Perfil, Patrocinadores
from .serializers import PedaniaSerializer, AnuncioSerializer, InscripcionSerializer, ComentarioSerializer, PerfilSerializer, UserSerializer, PatrocinadoresSerializer
from .permissions import IsOrganizacionOrAdmin, IsOwnerOrAdmin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth.models import User
from .utils import send_welcome_email, send_inscription_email

# R-> viewsets -> Nos crea automaticamente el get / post / get id / put / delete 
# R-> IsAuthenticatedOrReadOnly -> Si vienes con Get | Pasa -> Si vienes con Post | No, registrate
class PedaniaViewSet(viewsets.ModelViewSet):
    queryset = Pedania.objects.all()
    serializer_class = PedaniaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# R-> Cualquiera ve anuncios pero solo las organizaciones/admin crean y editan sus propios anuncios
class AnuncioViewSet(viewsets.ModelViewSet):
    queryset = Anuncio.objects.all()
    serializer_class = AnuncioSerializer
    permission_classes = [IsOrganizacionOrAdmin, IsOwnerOrAdmin]

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
        inscripcion = serializer.save(usuario=self.request.user)
        if inscripcion.usuario.email:
            send_inscription_email(inscripcion.usuario.email, inscripcion.usuario.username, inscripcion.anuncio)

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
        # Permitimos ver todos los perfiles si estás autenticado
        return Perfil.objects.all()

from rest_framework.authtoken.models import Token

class RegisterView(APIView):
    # Corrección: Evitamos el error de "token CSRF missing" que ocurría esporádicamente
    # (cada cierto tiempo) cuando el navegador del usuario tenía una cookie de sesión guardada
    # (por ejemplo, por haber entrado al panel de administrador). 
    # Al estar SessionAuthentication activa por defecto, exigía CSRF. Al limpiar las clases de
    # autenticación para esta vista pública, solucionamos el problema permanentemente.
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            password = request.data.get('password')
            if not password:
                return Response({'password': ['Este campo es obligatorio.']}, status=status.HTTP_400_BAD_REQUEST)
                
            user = serializer.save()
            user.set_password(password)
            user.save()
            
            # Crear perfil automáticamente usando el valor correcto del choice ('voluntario')
            Perfil.objects.create(user=user, rol='voluntario') 
            
            # Generar token real
            token, created = Token.objects.get_or_create(user=user)
            
            if user.email:
                send_welcome_email(user.email, user.username, is_organization=False)
            
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

        # 1. Actualizar datos del Usuario (Validación de email único incluida en UserSerializer)
        user_serializer = UserSerializer(user, data=data, partial=True)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_serializer.save()

        # 2. Actualizar datos del Perfil
        # Usamos el serializer para validar y guardar (partial=True permite enviar solo algunos campos)
        serializer = PerfilSerializer(perfil, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            # Retornamos los datos actualizados
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CrearOrganizacionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Doble check para asegurarse que es admin
        is_admin = bool(request.user and request.user.is_authenticated and 
                        (request.user.is_staff or getattr(getattr(request.user, 'perfil', None), 'rol', '').lower() == 'administrador'))
        if not is_admin:
            return Response({'error': 'No tienes permisos para crear una organización'}, status=status.HTTP_403_FORBIDDEN)
            
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            if 'password' in data:
                user.set_password(data['password'])
            else:
                user.set_password('voluntariado2024') # Contraseña por defecto
            user.save()
            
            # Crear perfil automáticamente
            Perfil.objects.create(
                user=user, 
                rol='organizacion',
                nombre_entidad=data.get('nombre_entidad', '')
            )
            
            if user.email:
                send_welcome_email(user.email, user.username, is_organization=True)
                
            return Response({'mensaje': 'Organización creada exitosamente', 'user': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatrocinadorViewSet(viewsets.ModelViewSet):
    queryset = Patrocinadores.objects.all()
    serializer_class = PatrocinadoresSerializer

class GlobalSearchView(APIView):
    """
    Endpoint para buscar en múltiples modelos: Anuncios (actividades y noticias) y Perfiles.
    """
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query or len(query) < 2:
            return Response({'results': []})

        results = []

        # 1. Buscar en Anuncios (Actividades y Noticias)
        from django.utils import timezone
        from django.db.models import Q
        
        anuncios = Anuncio.objects.filter(
            Q(titulo__icontains=query) | 
            Q(descripcion__icontains=query) |
            Q(etiqueta__icontains=query) |
            Q(pedanias__nombre__icontains=query)
        ).filter(estado__in=['publicado', 'finalizado'])[:5]

        for a in anuncios:
            is_news = a.estado == 'finalizado' or a.fecha_evento < timezone.now()
            
            results.append({
                'id': a.id,
                'type': 'noticia' if is_news else 'actividad',
                'title': a.titulo,
                'subtitle': f"{a.pedanias.nombre} • {a.fecha_evento.strftime('%d/%m/%Y')}",
                'image': a.imagen.url if a.imagen else None,
                'url': f"/actividades/{a.id}"
            })

        # 2. Buscar en Perfiles (Organizaciones y Voluntarios)
        perfiles = Perfil.objects.filter(
            Q(nombre_entidad__icontains=query) | 
            Q(user__username__icontains=query) |
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query) |
            Q(rol__icontains=query)
        )[:5]

        for p in perfiles:
            results.append({
                'id': p.id,
                'type': 'organizacion' if p.rol == 'organizacion' else 'voluntario',
                'title': p.nombre_entidad if p.rol == 'organizacion' else f"{p.user.first_name} {p.user.last_name}".strip() or p.user.username,
                'subtitle': p.rol.capitalize(),
                'image': p.foto.url if p.foto else None,
                'url': "/perfil" if p.user == request.user else f"/perfil/{p.id}"
            })

        return Response({'results': results})