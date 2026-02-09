import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from voluntariado.models import Perfil

def create_admin():
    username = 'admin'
    password = 'admin123'
    email = 'admin@example.com'

    if User.objects.filter(username=username).exists():
        print(f"User {username} already exists. Resetting password.")
        user = User.objects.get(username=username)
        user.set_password(password)
        user.save()
    else:
        print(f"Creating user {username}...")
        user = User.objects.create_superuser(username=username, email=email, password=password)
        
    # Ensure profile exists
    Perfil.objects.get_or_create(user=user, rol='organizacion', nombre_entidad='Ayuntamiento de Mazarrón')
    
    print(f"Successfully configured user '{username}' with password '{password}'")

if __name__ == '__main__':
    create_admin()
