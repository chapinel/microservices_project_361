from app.db import db

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=False, nullable=False)
    service_id = db.Column(db.Integer, unique=True, nullable=True)

    games = db.relationship("User_Game", back_populates="user")

    def __init__(self, user_data):
        self.username = user_data["username"]
        self.password = user_data["password"] 
        self.email = user_data["email"]
        if user_data["service_id"] != None:
            self.service_id = user_data["service_id"]

    def __repr__(self):
        return '<User %r>' % self.username

class Game(db.Model):
    __tablename__ = 'game'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    url = db.Column(db.String(200), unique=True, nullable=False)

    users = db.relationship("User_Game", back_populates="game")
    note = db.relationship("Note")

    def __init__(self, name, url):
        self.name = name
        self.url = url

    def __repr__(self):
        return '<Game %r>' % self.name

class User_Game(db.Model):
    __tablename__ = 'user_game'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), primary_key=True)
    mail = db.Column(db.Integer, nullable=True)
    user = db.relationship("User", back_populates="games")
    game = db.relationship("Game", back_populates="users")

    def __init__(self, user, game, mail=0):
        self.user_id = user
        self.game_id = game
        self.mail = mail

    def __repr__(self):
        return "<User_Game(user='%s',game='%s',mail='%s')>" % (self.user_id, self.game_id, self.mail)

class Note(db.Model):
    __tablename__ = 'note'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(), unique=False, nullable=False)
    description = db.Column(db.String(), unique=False, nullable=False)
    url = db.Column(db.String(200), unique=False, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    banner = db.Column(db.String(), unique=False, nullable=False)
    date = db.Column(db.String(15), unique=False, nullable=False)

    def __init__(self, note_data):
        self.title = note_data["title"]
        self.description = note_data["description"]
        self.url = note_data["url"]
        self.game_id = note_data["game"]
        self.banner = note_data["banner"]
        self.date = note_data["date"]


    def __repr__(self):
        return '<Note %r>' % self.title