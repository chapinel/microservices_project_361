import os

from flask import Flask
from flask_cors import CORS, cross_origin

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    cors = CORS(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite')
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db
    db.init_app(app)

    @app.route('/')
    @cross_origin()
    def index():
        return 'This is the index route'
    
    from . import auth 
    app.register_blueprint(auth.bp)

    from . import note 
    app.register_blueprint(note.bp)

    from . import game
    app.register_blueprint(game.bp)

    from . import mail
    app.register_blueprint(mail.bp)
    
    return app