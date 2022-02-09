from flask import (
    Blueprint, request, url_for, g, jsonify
)

from flaskr.db import get_db

bp = Blueprint('mail', __name__, url_prefix='/mail')

@bp.route('/add', methods=['GET', 'POST', 'OPTIONS'])
def add_user_game():
    if request.method == 'POST':
        data = request.get_json()
        user = data["user"]
        game = data["game"]
        db = get_db()
        error = None

        if not user:
            error = 'username is required'
        elif not game:
            error = 'game is required'

        if error is None:
            game_id = db.execute("SELECT id from game where name = ?", (game,)
            ).fetchone()
            
            if game_id is None:
                error = "game not found in database"
            
            user_id = db.execute("SELECT id from user where username = ?", (user,)
            ).fetchone()

            if user_id is None:
                error = "user not found in database"

        if error is None:
            game_id = game_id["id"]
            user_id = user_id["id"]

            try:
                db.execute(
                    "INSERT INTO users_games (game_id, user_id) VALUES (?, ?)",
                    (game_id, user_id),
                )
                db.commit()
            except db.IntegrityError:
                error = f"Relationship {user, game} already exists"
            else:
                response = jsonify( { "success": True } )
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
        
        return (error, 500)
    
    if request.method == 'OPTIONS':
        response = "success"
        return response

@bp.route('/get', methods=['GET', 'POST'])
def get_user_game():
    user = request.args.get("user", None)
    db = get_db()
    error = None

    if not user:
        error = 'Must include username'
    
    if error is None:
        user = db.execute(
            "SELECT id from user WHERE username = ?", (user,)
        ).fetchone()

        if user is None:
            error = 'User not found in database'
    
    if error is None:
        user_id = user["id"]

        games = db.execute("SELECT * from users_games where user_id = ?", (user_id,)
        ).fetchall()

        data = []
        for user_game in games:
            data.append(list(user_game))
        
        response = jsonify( { "mail": data } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)

@bp.route('/delete', methods=['DELETE'])
def delete_user_game():
    if request.method == 'DELETE':
        data = request.get_json()
        user = data["user"]
        game = data["game"]
        db = get_db()
        error = None

        if not user:
            error = 'username is required'
        elif not game:
            error = 'game is required'

        if error is None:
            game_id = db.execute("SELECT id from game where name = ?", (game,)
            ).fetchone()
            
            if game_id is None:
                error = "game not found in database"
            
            user_id = db.execute("SELECT id from user where username = ?", (user,)
            ).fetchone()

            if user_id is None:
                error = "user not found in database"

        if error is None:
            game_id = game_id["id"]
            user_id = user_id["id"]

            try:
                db.execute(
                    "DELETE FROM users_games WHERE user_id = ? and game_id = ?",
                    (user_id, game_id),
                )
                db.commit()
            except db.IntegrityError:
                error = f"Failed to delete relationship {user, game} from database"
            else:
                return jsonify( { "success": True } ), 200
        
        return (error, 500)
    
    if request.method == 'OPTIONS':
        response = "success"
        return response