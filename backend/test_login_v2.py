import os
import django

# Force correct settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
django.setup()

from django.contrib.auth.models import User
from rest_framework.test import APIClient

def check_login():
    username = 'admin'
    password = 'admin123'
    
    print(f"Checking user: {username}")
    
    try:
        user = User.objects.get(username=username)
        print(f"User exists. Active: {user.is_active}")
        if user.check_password(password):
            print("Password matches.")
        else:
            print("Password DOES NOT match.")
            user.set_password(password)
            user.save()
            print("Password reset to 'admin123'.")
    except User.DoesNotExist:
        print("User not found.")
        User.objects.create_superuser(username, 'admin@test.com', password)
        print("User created.")

    # Test via API Client (simulates request)
    client = APIClient()
    response = client.post('/api/login/', {'username': username, 'password': password}, format='json')
    
    print(f"API Login Response Status: {response.status_code}")
    print(f"API Login Response Body: {response.data}")

if __name__ == '__main__':
    check_login()
