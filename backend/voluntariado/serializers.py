from rest_framework import serializers
from .models import Pedania, Perfil, Anuncio, Inscripcion, Comentario
#Importo la tabla User porque la usaré en el serializer de Perfil
from django.contrib.auth.models import User

# ¿Qué hace? -> Convierte tus datos de la base de datos (Que tenemos en python) a formato JSON para que React los pueda leer.
# Lo que hacemos es ver que modelo cogemos, hacemos una clase "Serializer" para cada modelo y cogemos los campos que queremos mandar.
# Por ejemplo en usuario NO cogemos contraseñas porque no nos interesa mandarlas.

class PedaniaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedania
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']

class PerfilSerializer(serializers.ModelSerializer):
    
    user = UserSerializer(read_only=True)
    class Meta:
        model = Perfil
        fields = ['id', 'user', 'rol', 'telefono', 'foto', 'fecha_nacimiento']

class AnuncioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anuncio
        fields = '__all__'

class InscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscripcion
        fields = '__all__'

class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = '__all__'