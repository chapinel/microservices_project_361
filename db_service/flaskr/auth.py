from flask import (
    Blueprint, request, url_for, g, jsonify
)
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

@bp.route('/login', methods=['GET', 'POST'])
def login():
    username = request.form['username']
    password = request.form['password']
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

    return (error, 500)