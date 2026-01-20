from django.db import models
from django.contrib.auth.models import User

class Perfil(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')

    ROLES = [
        ('voluntario', 'Voluntario'),
        ('Administrador', 'Administrador de la plataforma'),
    ]

    rol = models.CharField(max_length=20, choices=ROLES, default='voluntario')
    telefono = models.CharField(max_length=15, blank=True, null=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    foto = models.ImageField(upload_to='fotos_perfil/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.rol}"
    

class Pedania(models.Model):

    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre

class Anuncio(models.Model):

    ETIQUETAS = [
        ('medio_ambiente', 'Medio Ambiente'),
        ('educacion', 'Educación'),
        ('salud', 'Salud'),
        ('comunidad', 'Comunidad'),
        ('animales', 'Animales'),
        ('otros', 'Otros'),]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    #Organizador = Persona o entidad
    organizador = models.CharField(max_length=200)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_evento = models.DateField()
    etiqueta = models.CharField(max_length=50, choices=ETIQUETAS, default='otros')
    updated_at = models.DateTimeField(auto_now=True)
    #Creador + Lugar donde se hace
    pedanias = models.ForeignKey(Pedania, on_delete=models.CASCADE, related_name='anuncios')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anuncios_creados')
    
    def __str__(self): 
        return self.titulo
    
class Inscripcion(models.Model):

    anuncio = models.ForeignKey(Anuncio, on_delete=models.CASCADE, related_name='inscripciones')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscripciones_realizadas')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    # Clase "Meta" para definir restricciones únicas y que no se pueda inscribir un usuario más de una vez al mismo anuncio
    class Meta:
        unique_together = ('anuncio', 'usuario')

    def __str__(self):
        return f"Inscripción de {self.usuario.username} en {self.anuncio.titulo}"
    
class Comentario(models.Model):

    anuncio = models.ForeignKey(Anuncio, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comentarios_realizados')
    contenido = models.TextField()
    fecha_comentario = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comentario de {self.usuario.username} en {self.anuncio.titulo}"
    
