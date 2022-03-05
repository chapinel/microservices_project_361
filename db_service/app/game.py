from app.db import db
from app.models import User, User_Game, Game, Note
from flask import Blueprint, request, jsonify

bp = Blueprint('game', __name__, url_prefix='/game')

def get_game_info(game, query_type):
    if query_type == "name":
        game = Game.query.filter_by(name=game).first()
    else:
        game = Game.query.filter_by(id=game).first()
    
    if game is None:
        return game
    else:
        return { "id": game.id, "name": game.name, "url": game.url }

@bp.route('/add', methods=['POST'])
def add_game():
    # if the form does not contain the following keys, the request will fail
    name = request.form["name"]
    url = request.form["url"]

    new_game = Game(name=name, url=url)
    try:
        db.session.add(new_game)
        db.session.commit()
    except Exception as e:
        error = str(e)
        return (error, 500)

    return jsonify( {"success": True } )

@bp.route('/get-from-name', methods=['GET'])
def get_game_name():
    game = request.args.get('game', None)
    error = None

    if not game:
        error = ('Must include game name', 400)
    
    if error is None:
       game = get_game_info(game, "name")
       if game is None:
           error = ("Game not found", 406)
       else:
           response = jsonify(game)
           return response
    
    return error

@bp.route('/get-from-id', methods=['GET'])
def get_game_id():
    game_id = request.args.get("game", None)
    error = None

    if not game_id:
        error = ("Must include game id", 400)
    
    if error is None:
        game = get_game_info(game_id, "id")
        if game is None:
            error = ("Game not found", 406)
        else:
            response = jsonify(game)
            return response
        
    return error

@bp.route('/get-all', methods=['GET'])
def get_games():
    game = request.args.get("game", None)

    games = Game.query.all()

    list_of_games = []

    for game in games:
        game = [game.id, game.name, game.url]
        list_of_games.append(game)

    response = jsonify(list_of_games)
    return response