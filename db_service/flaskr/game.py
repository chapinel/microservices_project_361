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
                return jsonify( { "success": True } ), 201
        
        return (error, 500)

@bp.route('/get', methods=['GET', 'POST'])
def get_game():
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
        return jsonify( { "id": game_info["id"], "name": game_info["name"], "url": game_info["url"] }), 200

    return (error, 500)

@bp.route('/get-all', methods=['GET', 'POST'])
def get_all_games():
    db = get_db()

    games = db.execute(
        "SELECT * from game"
    ).fetchall()

    return jsonify ( { "game": games} ), 200