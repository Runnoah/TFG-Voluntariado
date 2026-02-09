import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

def reset_admin():
    try:
        user = User.objects.get(username='admin')
        user.set_password('admin123')
        user.save()
        
        # Ensure token exists
        token, _ = Token.objects.get_or_create(user=user)
        
        print(f"User 'admin' password set to 'admin123'.")
        print(f"Token: {token.key}")
        
    except User.DoesNotExist:
        print("User 'admin' not found. Creating...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("User 'admin' created with password 'admin123'")

if __name__ == '__main__':
    reset_admin()
