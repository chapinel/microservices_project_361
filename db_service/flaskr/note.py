from flask import (
    Blueprint, request, url_for, g, jsonify
)

import sys
import traceback

from flaskr.db import get_db

bp = Blueprint('note', __name__, url_prefix='/note')

@bp.route('/add', methods=['GET', 'POST'])
def add_note():
    if request.method == 'POST':
        title = request.form["title"]
        description = request.form["description"]
        url = request.form["url"]
        game = request.form["game"]
        banner = request.form["banner"]
        date = request.form["date"]
        db = get_db()
        error = None

        if not title:
            error = 'Title is required'
        elif not description:
            error = 'Description is required'
        elif not url:
            error = 'URL is required'
        elif not game:
            error = 'Game is required'
        elif not date:
            error = 'Date is required'

        if error is None:
            game_id = db.execute(
            "SELECT id FROM game WHERE name = ?", (game,)
            ).fetchone()

            if game_id is None:
                error = "Game not found in database"
            else:
                game_id = game_id["id"]
                
                try:
                    db.execute(
                        "INSERT INTO note (title, description, url, game, banner, date) VALUES (?, ?, ?, ?, ?, ?)",
                        (title, description, url, game_id, banner, date),
                    )
                    db.commit()
                except db.IntegrityError:
                    error = f"Note {title} already exists"
                else:
                    response = jsonify( { "success": True } )
                    response.headers.add('Access-Control-Allow-Origin', '*')
                    return response

        return (error, 500)

@bp.route('/get', methods=['GET', 'POST'])
def get_notes():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game name'

    game_id = db.execute(
            "SELECT id FROM game WHERE name = ?", (game,)
            ).fetchone()
    
    if game_id is None:
        error = 'Game not found in database'
    
    game_id = game_id["id"]

    if error is None:
        notes = db.execute(
            "SELECT * FROM note WHERE game = ?", (game_id,)
        ).fetchall()

        data = []
        for note in notes:
            data.append(list(note))
    
        response = jsonify( { "notes": data })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)

@bp.route('/get-latest', methods=['GET'])
def get_latest():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game id'

    if error is None:
        notes = db.execute(
            "SELECT date, banner FROM note WHERE game = ? ORDER BY date DESC", (game,)
        ).fetchone()

        if notes is None:
            error = "No notes found for this game"
        else:
            date = notes["date"]
            banner = notes["banner"]
    
            response = jsonify( { "date": date, "banner": banner })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    return (error, 500)


@bp.route('/get-count', methods=['GET'])
def get_count():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game name'

    if error is None:
        count = db.execute(
            "SELECT COUNT(*) FROM note WHERE game = ?", (game,)
        ).fetchone()

        if count is None:
            error = "No notes found for this game"
        else:
            total = count["COUNT(*)"]
    
            response = jsonify( { "count": total })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    return (error, 500)

@bp.route('/delete-all', methods=['DELETE'])
def delete_all():
    game = request.args.get("game", None)
    db = get_db()
    error = None

    if not game:
        error = 'Must include game name'
    
    if error is None:
        game_id = db.execute(
            "SELECT id FROM game WHERE name = ?", (game,)
        ).fetchone()

        if game_id is None:
            error = "Game not found in database"
        else:
            game_id = game_id["id"]
            try:
                db.execute(
                    "DELETE FROM note WHERE game = ?", (game_id,)
                )
                db.commit()
            except db.Error as er:
                print('SQLite error: %s' % (' '.join(er.args)))
                print("Exception class is: ", er.__class__)
                print('SQLite traceback: ')
                exc_type, exc_value, exc_tb = sys.exc_info()
                print(traceback.format_exception(exc_type, exc_value, exc_tb))
                error = "Unable to update column"
            
            if error is None:
                response = jsonify( { "success": True } )
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
    return (error, 500)