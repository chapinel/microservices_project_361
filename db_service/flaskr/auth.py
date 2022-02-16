from flask import (
    Blueprint, request, url_for, g, jsonify
)
import sys
import traceback
from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/add', methods=['GET', 'POST'])
def add_user():
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
        email = data['email']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif not email:
            error = 'Email is required'
        
        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, email, password) VALUES (?, ?, ?)",
                    (username, email, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} already registered"
            else:
                response = jsonify( { "success": True } )
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
        
        return (error, 500)

@bp.route('/update', methods=['PUT'])
def update_user():
    if request.method == 'PUT':
        data = request.get_json()
        username = data['user']
        service_id = data['id']
        db = get_db()
        error = None

        try:
            db.execute("UPDATE user SET service_id = ? WHERE username = ?", (service_id, username))
            db.commit()
        except db.Error:
            error = "There was an error trying to update the ID"
        
        if error is None:
            response = jsonify( {"success": True } )
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
            
        return (error, 500)

@bp.route('/update-all', methods=['PUT'])
def update_all_user_data():
    if request.method == 'PUT':
        data = request.get_json()
        username = data['user']
        service_id = data['id']
        new_name = data['name']
        new_email = data['email']
        db = get_db()
        error = None

        try:
            db.execute("UPDATE user SET service_id = ?, username = ?, email = ? WHERE username = ?", (service_id, new_name, new_email, username))
            db.commit()
        except db.Error as er:
            print('SQLite error: %s' % (' '.join(er.args)))
            print("Exception class is: ", er.__class__)
            print('SQLite traceback: ')
            exc_type, exc_value, exc_tb = sys.exc_info()
            print(traceback.format_exception(exc_type, exc_value, exc_tb))
            error = "Unable to update column"
        
        if error is None:
            response = jsonify( {"success": True } )
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
            
        return (error, 500)

@bp.route('/get-all', methods=['GET'])
def get_user():

    db = get_db()
    error = None

    users = db.execute(
        "SELECT * from user"
    ).fetchall()

    data = []
    for user in users:
        data.append(list(user))

    response = jsonify( { "users": data } )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@bp.route('/get-one', methods=['GET'])
def get_one_user():
    user = request.args.get("user", None)
    db = get_db()
    error = None

    if user is None:
        error = "Username required"
    
    if error is None:
        user = db.execute(
            "SELECT email, service_id FROM user WHERE username = ?", (user,)
        ).fetchone()
    
        if user is None:
            error = "Couldn't find that user in the database"
        else:
            response = jsonify( {"email": user["email"], "service_id": user["service_id"]})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    return (error, 500)

@bp.route('/get-one-id', methods=['GET'])
def get_one_from_id():
    user = request.args.get("user", None)
    db = get_db()
    error = None

    if user is None:
        error = "User id required"
    
    if error is None:
        user = db.execute(
            "SELECT service_id FROM user WHERE id = ?", (user,)
        ).fetchone()
    
        if user is None:
            error = "Couldn't find that user in the database"
        else:
            response = jsonify( {"service_id": user["service_id"]})
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    return (error, 500)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    db = get_db()
    error = None
    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    if user is None:
        error = 'Incorrect username.'
    elif not check_password_hash(user['password'], password):
        error = 'Incorrect password.'

    if error is None:
        return jsonify( { "success": True })

    return jsonify( {"error": error }), 400