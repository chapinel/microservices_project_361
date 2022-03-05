import os

SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL').replace("postgres://", "postgresql://", 1)
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
SQLALCHEMY_TRACK_MODIFICATIONS = False