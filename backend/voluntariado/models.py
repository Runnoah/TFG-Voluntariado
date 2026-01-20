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
    

class Pedanias(models.Model):

    nombre = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre

class Anuncios(models.Model):

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_evento = models.DateField()
    pedanias_id = models.ForeignKey(Pedanias, on_delete=models.CASCADE, related_name='anuncios')
    perfil_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='anuncios_creados')
    
    def __str__(self):
        return self.titulo