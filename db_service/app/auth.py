from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from app.db import db
from app.models import User, User_Game, Game, Note

bp = Blueprint('auth', __name__, url_prefix='/auth')

def get_user(user, query_type):
    if query_type == "username":
        result = User.query.filter_by(username=user).first()
    else:
        result = User.query.filter_by(id=user).first()
    return result

@bp.route('/add', methods=['POST'])
def add_user():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    username = data['username']
    password = data['password']
    email = data['email']
    error = None
    
    if error is None:
        try:
            user_data = {
                "username": username,
                "password": generate_password_hash(password),
                "email": email,
                "service_id": None,
            }
            new_user = User(user_data=user_data)
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            error = str(e)
    
    if error is None:
        return jsonify( {"success": True } )
    
    return (error, 500)

@bp.route('/add-mail-id', methods=['PUT'])
def user_add_mail():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    username = data['user']
    service_id = data['id']
    error = None

    try:
        user = get_user(username, "username")
        if user is None:
            error = ('User not found', 406)
        else:
            user.service_id = service_id
            db.session.commit()
    except Exception as e:
        error = (str(e), 500)
    
    if error is None:
        return jsonify( {"success": True } )
    
    return error

@bp.route('/update-all', methods=['PUT'])
def update_all_user():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    username = data['user']
    service_id = data['id']
    new_name = data['name']
    new_email = data['email']
    error = None 

    try:
        user = get_user(username, "username")
        if user is None:
            error = ('User not found', 406)
        else:
            user.username = new_name
            user.email = new_email
            user.service_id = service_id
            db.session.commit()
    except Exception as e:
        error = (str(e), 500)
        
    if error is None:
        return jsonify( {"success": True } )
    
    return error

@bp.route('/get-all', methods=['GET'])
def get_all_users():
    
    users = User.query.all()

    list_of_users = []

    for user in users:
        user = [user.username, user.email, user.service_id]
        list_of_users.append(user)
    
    response = jsonify(list_of_users)
    return response

@bp.route('/get-one', methods=['GET'])
def get_one_user():
    user = request.args.get('user', None)
    error = None

    if user is None:
        error = ('Username is required', 400)
    
    if error is None:
        user = get_user(user, "username")
        if user is None:
            error = ("Couldn't find that user", 406)
        else:
            response = jsonify({ "email": user.email, "service_id": user.service_id })
            return response
        
    return error

@bp.route('/get-one-id', methods=['GET'])
def get_one_user_id():
    user = request.args.get('user', None)
    error = None

    if user is None:
        error = ("User id required", 400)
    
    if error is None:
        user = get_user(user, "id")
        if user is None:
            error = ("Couldn't find that user", 406)
        else:
            response = jsonify( {"service_id": user.service_id} )
            return response 
        
    return error

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # if the returned json does not contain the following keys, the request will fail
    username = data['username']
    password = data['password']
    error = None

    user = get_user(username, "username")
    
    if user is None:
        error = ('Incorrect username', 406)
    elif not check_password_hash(user.password, password):
        error = ('Incorrect password', 400)
    
    if error is None:
        return jsonify({ "success": True })
    
    return error