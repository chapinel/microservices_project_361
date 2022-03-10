from flask import Blueprint, request, jsonify
from app.db import db
from app.models import User, Game, User_Game, Note

bp = Blueprint('mail', __name__, url_prefix='/mail')

def get_user_id_by_name(user):
    result = User.query.filter_by(username=user).first()
    if result is not None:
        return result.id
    return result

def get_game_id_by_name(game):
    result = Game.query.filter_by(name=game).first()
    if result is not None:
        return result.id
    return result

@bp.route('/add', methods=['POST'])
def add_user_game():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    user = data["user"]
    game = data["game"]
    error = None

    if error is None:
        game_id = get_game_id_by_name(game)
        user_id = get_user_id_by_name(user)

        if game_id is None or user_id is None:
            error = ('Info not found in database', 406)
        else:
            try:
                new_user_game = User_Game(user=user_id, game=game_id)
                db.session.add(new_user_game)
                db.session.commit()
            except Exception as e:
                error = (str(e), 500)
    
    if error is None:
        return jsonify( {"success": True } )
    
    return error

@bp.route('/get-mail', methods=['GET'])
def get_one():
    user=request.args.get("user", None)
    game=request.args.get("game", None)
    error = None

    if not user:
        error = ('username is required', 400)
    elif not game:
        error = ('game is required', 400)
    
    if error is None:
        game_id = get_game_id_by_name(game)
        user_id = get_user_id_by_name(user)

        if game_id is None or user_id is None:
            error = ('Info not found in database', 406)
        else:
            mail = User_Game.query.filter_by(user_id=user_id, game_id=game_id).first()
            if mail is None:
                error = ('No relationship exists for this user and game', 406)
    
    if error is None:
        response = jsonify({"mail": mail.mail})
        return response
    
    return error

@bp.route('/get-games-for-user', methods=['GET'])
def get_user_games():
    user = request.args.get("user", None)
    error = None

    if not user:
        error = ('username is required', 400)
    
    if error is None:
        user_id = get_user_id_by_name(user)

        if user_id is None:
            error = ('Info not found in database', 406)
        else:
            games = User_Game.query.filter_by(user_id=user_id).all()

        data = []
        for user_game in games:
            user_game = [user_game.game_id, user_game.user_id, user_game.mail]
            data.append(user_game)

        response = jsonify({"mail": data})
        return response
    
    return error

@bp.route('/get-users-for-game', methods=['GET'])
def get_game_users():
    game = request.args.get("game", None)
    error = None

    if not game:
        error = ('game is required', 400)
    
    if error is None:
        game_id = get_game_id_by_name(game)

        if game_id is None:
            error = ('Info not found in database', 406)
        else:
            games = User_Game.query.filter_by(game_id=game_id).all()
            data = []
            for user_game in games:
                if user_game.mail == 1:
                    data.append(user_game.user_id)

            response = jsonify({"users": data})
            return response
    
    return error

@bp.route('/update', methods=['PUT'])
def update_user_game():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    user = data["user"]
    game = data["game"]
    mail = data["mail"]
    error = None
    
    if error is None:
        game_id = get_game_id_by_name(game)
        user_id = get_user_id_by_name(user)

        if game_id is None or user_id is None:
            error = ('Info not found in database', 406)
        else:
            try:
                user_game = User_Game.query.filter_by(user_id=user_id, game_id=game_id).first()
                user_game.mail = mail
                db.session.commit()
            except Exception as e:
                error = (str(e), 500)
    
    if error is None:
        response = jsonify( {"success": True } )
        return response

    return error

@bp.route('/delete', methods=['DELETE'])
def delete_user_game():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    user = data["user"]
    game = data["game"]
    error = None

    game_id = get_game_id_by_name(game)
    user_id = get_user_id_by_name(user)

    if game_id is None or user_id is None:
        error = ('Info not found in database', 406)
    else:
        try:
            User_Game.query.filter_by(user_id=user_id, game_id=game_id).delete()
            db.session.commit()
        except Exception as e:
            error = (str(e), 500)
    
    if error is None:
        return jsonify( {"success": True } )
    
    return error