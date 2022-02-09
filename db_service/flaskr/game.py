from flask import (
    Blueprint, request, url_for, g, jsonify
)

from flaskr.db import get_db

bp = Blueprint('game', __name__, url_prefix='/game')

@bp.route('/add', methods=['GET', 'POST'])
def add_game():
    if request.method == 'POST':
        name = request.form["name"]
        url = request.form["url"]
        db = get_db()
        error = None

        if not name:
            error = 'name is required'
        elif not url:
            error = 'URL is required'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO game (name, url) VALUES (?, ?)",
                    (name, url),
                )
                db.commit()
            except db.IntegrityError:
                error = f"Game {name} already exists"
            else:
                response = jsonify( { "success": True } )
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
        
        return (error, 500)

@bp.route('/get-from-name', methods=['GET', 'POST'])
def get_game_name():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game name'
    
    if error is None:
        game_info = db.execute(
            "SELECT * FROM game WHERE name = ?", (game,)
        ).fetchone()

        if game_info is None:
            error = 'Game not found in database'
    
    if error is None:
        response = jsonify( { "id": game_info["id"], "name": game_info["name"], "url": game_info["url"] })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)

@bp.route('/get-from-id', methods=['GET', 'POST'])
def get_game_id():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game id'
    
    if error is None:
        game_info = db.execute(
            "SELECT * FROM game WHERE id = ?", (game,)
        ).fetchone()

        if game_info is None:
            error = 'Game not found in database'
    
    if error is None:
        response = jsonify( { "id": game_info["id"], "name": game_info["name"], "url": game_info["url"] })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)

@bp.route('/get-all', methods=['GET', 'POST'])
def get_all_games():
    db = get_db()

    games = db.execute(
        "SELECT * from game"
    ).fetchall()

    data = []
    for game in games:
        data.append(list(game))

    response = jsonify( { "game": data } )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response