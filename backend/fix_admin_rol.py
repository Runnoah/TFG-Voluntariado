import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from voluntariado.models import Perfil

def fix_admin_rol():
    try:
        u = User.objects.get(username='admin')
        p, created = Perfil.objects.get_or_create(user=u)
        p.rol = 'Administrador'
        p.save()
        print("Admin role updated to 'Administrador'")
    except User.DoesNotExist:
        print("Admin user not found")

if __name__ == '__main__':
    fix_admin_rol()
