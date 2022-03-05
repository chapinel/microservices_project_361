import click
from flask.cli import with_appcontext

from .db import db
from .models import User, User_Game, Game, Note

@click.command(name='create_db')
@with_appcontext
def create_db():
    db.create_all()