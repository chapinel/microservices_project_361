from flask import (
    Blueprint, request, url_for, g, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
from flaskr.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/add', methods=['GET', 'POST'])
def add_user():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
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
                    "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
                    (username, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} already registered"
            else:
                return jsonify( { "success": True } ), 201
        
        return (error, 500)

@bp.route('/get', methods=['GET'])
def get_user():
    username = request.form['id']

    db = get_db()
    error = None

    if not username:
        error = 'user id is required'
    
    if error is None:
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", (username)
        ).fetchone()

        if user is None:
            error = "No matching user found"
    
    if error is None:
        return jsonify( { "id": user["id"], "email": user["email"], "service": user["service_id"] }), 200

    return (error, 500)

@bp.route('/login', methods=['GET'])
def login():
    username = request.form['username']
    password = request.form['password']
    db = get_db()
    error = None
    user = db.execute(
        'SELECT * FROM user WHERE name = ?', (username,)
    ).fetchone()

    if user is None:
        error = 'Incorrect username.'
    elif not check_password_hash(user['password'], password):
        error = 'Incorrect password.'

    if error is None:
        return jsonify( { "success": True }), 200

    return (error, 500)