import os
import django
from rest_framework.test import APIClient
from django.contrib.auth.models import User

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def test_login():
    username = 'admin'
    password = 'admin123'
    
    print(f"Testing login for user: {username}")
    
    # 1. Check if user exists and password is correct internally
    try:
        user = User.objects.get(username=username)
        print(f"User found: {user}")
        if user.check_password(password):
            print("Password check passed internally.")
        else:
            print("Password check FAILED internally.")
            # Hard reset to be sure
            user.set_password(password)
            user.save()
            print("Password forcibly reset.")
    except User.DoesNotExist:
        print("User does not exist!")
        return

    # 2. Simulate API Request
    from rest_framework.authtoken.models import Token
    token, _ = Token.objects.get_or_create(user=user)
    print(f"Token for user: {token.key}")

if __name__ == '__main__':
    test_login()
