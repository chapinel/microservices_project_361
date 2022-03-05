from flask import Flask
from .db import db
from .initialize import create_db

def create_app(config_file='config.py'):
    app = Flask(__name__)
    app.config.from_pyfile(config_file)

    db.init_app(app)

    from .models import User, Game, User_Game, Note

    app.cli.add_command(create_db)
    
    @app.route('/')
    def index():
        return 'connected'

    from . import game
    app.register_blueprint(game.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import mail
    app.register_blueprint(mail.bp)

    from . import note
    app.register_blueprint(note.bp)

    return app