from rest_framework import serializers
from .models import Pedania, Perfil, Anuncio, Inscripcion, Comentario, Patrocinadores
from django.contrib.auth.models import User

# -----------------------------------------------------------------------------
# USUARIOS Y PERFILES
# -----------------------------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False}
        }

    def validate_email(self, value):
        """
        Verifica que el email sea único, ignorando el usuario actual si es una edición.
        """
        user = self.instance
        if User.objects.filter(email=value).exclude(pk=user.pk if user else None).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

class PerfilSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    asistencias_count = serializers.ReadOnlyField(source='asistencias_confirmadas')
    marco = serializers.ReadOnlyField()
    
    class Meta:
        model = Perfil
        fields = ['id', 'user', 'rol', 'nombre_entidad', 'telefono', 'foto', 'fecha_nacimiento', 'asistencias_count', 'marco']

# -----------------------------------------------------------------------------
# UTILIDADES (Pedanías)
# -----------------------------------------------------------------------------

class PedaniaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedania
        fields = '__all__'

# -----------------------------------------------------------------------------
# ANUNCIOS (El núcleo)
# -----------------------------------------------------------------------------

class AnuncioSerializer(serializers.ModelSerializer):
    nombre_pedania = serializers.CharField(source='pedanias.nombre', read_only=True)
    
    nombre_organizador = serializers.CharField(source='usuario.username', read_only=True)
    
    plazas_restantes = serializers.ReadOnlyField(source='plazas_disponibles')

    class Meta:
        model = Anuncio
        fields = [
            'id', 'titulo', 'descripcion', 'imagen', 'fecha_publicacion', 
            'fecha_evento', 'etiqueta', 'estado', 'cupo_maximo', 
            'plazas_restantes', 'pedanias', 'nombre_pedania', 
            'usuario', 'nombre_organizador', 'noticia_resumen', 'noticia_imagen', 'requerimientos'
        ]
        
        # R -> Esto de aqui no se piden en el formulario
        read_only_fields = ['usuario', 'fecha_publicacion']

# -----------------------------------------------------------------------------
# INSCRIPCIONES Y COMENTARIOS
# -----------------------------------------------------------------------------

class InscripcionSerializer(serializers.ModelSerializer):

    titulo_anuncio = serializers.CharField(source='anuncio.titulo', read_only=True)
    
    class Meta:
        model = Inscripcion
        fields = ['id', 'anuncio', 'titulo_anuncio', 'usuario', 'fecha_inscripcion', 'asistido']
        read_only_fields = ['usuario', 'fecha_inscripcion', 'asistido']

    # R -> Si está lleno... :
    def validacion_lleno(self, data):
        anuncio = data['anuncio']
        if anuncio.cupo_maximo > 0 and anuncio.inscripciones.count() >= anuncio.cupo_maximo:
            raise serializers.ValidationError("Lo sentimos, este evento ya está completo.")
        return data

class ComentarioSerializer(serializers.ModelSerializer):
    nombre_usuario = serializers.CharField(source='usuario.username', read_only=True)
    foto_usuario = serializers.ImageField(source='usuario.perfil.foto', read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'anuncio', 'usuario', 'nombre_usuario', 'foto_usuario', 'contenido', 'fecha_comentario']
        read_only_fields = ['usuario', 'fecha_comentario']

class PatrocinadoresSerializer(serializers.ModelSerializer):

    class Meta:
        model = Patrocinadores
        fields = '__all__'