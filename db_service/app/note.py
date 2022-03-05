from flask import Blueprint, request, jsonify
from app.db import db
from app.models import User, User_Game, Note, Game

bp = Blueprint('note', __name__, url_prefix='/note')

def get_game_id_by_name(game):
    result = Game.query.filter_by(name=game).first()
    if result is not None:
        return result.id
    return result

@bp.route('/add', methods=['POST'])
def add_note():
    # if the form does not contain the following keys, the request will fail
    title = request.form["title"]
    description = request.form["description"]
    url = request.form["url"]
    game = request.form["game"]
    banner = request.form["banner"]
    date = request.form["date"]

    error = None

    if error is None:
        game_id = get_game_id_by_name(game)
        
        if game is None:
            error = ('Game not found', 406)
        else:
            note_data = {
                "title": title,
                "description": description,
                "url": url,
                "game": game_id,
                "banner": banner,
                "date": date,
            }
            try:
                new_note = Note(note_data=note_data)
                db.session.add(new_note)
                db.session.commit()
            except Exception as e:
                error = (str(e), 500)

        if error is None:
            return jsonify( {"success": True } )
    
    return error

@bp.route('/get', methods=['GET'])
def get_notes_for_game():
    game = request.args.get("game", None)
    error = None

    if not game:
        error = ('Must include game name', 400)
    
    game_id = get_game_id_by_name(game)
    if game_id is None:
        error = ('Game not found in database', 406)
    else:
        notes = Note.query.filter_by(game_id=game_id).all()

        list_of_notes = []

        for note in notes:
            note = {"id": note.id, "title": note.title, "description": note.description, "url": note.url, 
                "game": note.game_id, "banner": note.banner, "date": note.date}
            list_of_notes.append(note)
        
        response = jsonify({"notes": list_of_notes})
        return response 
    
    return error

@bp.route('/get-latest-and-count', methods=['GET'])
def get_latest():
    game = request.args.get('game', None)
    error = None

    if not game:
        error = ('Must include game id', 400)
    
    if error is None:
        count = Note.query.filter_by(game_id=game).count()
        if count > 0:
            note = Note.query.filter_by(game_id=game).order_by(Note.date.desc()).first()
            date = note.date
            banner = note.banner
            response = jsonify( {"date": date, "banner": banner, "count": count} )
            return response 
    
    return error