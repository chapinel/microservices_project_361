import requests

from flask import (
    Blueprint, request, jsonify
)

bp = Blueprint('reddit', __name__, url_prefix='/reddit')

def check_keyword(text, title, keyword):
    keyword = " " + keyword + " "
    keyword = keyword.upper()
    text = text.upper()
    title = title.upper()

    if keyword in text or keyword in title:
        return True
    
    return False

def check_username(author, username):
    if author.upper() == username.upper():
        return True
    return False


def parse_post(post_data, username, keyword):

    if username:
        username_match = check_username(post_data["username"], username)
    if keyword:
        keyword_match = check_keyword(post_data["text"], post_data["title"], keyword)
    
    if username and keyword:
        if username_match and keyword_match:
            return True
    elif username:
        if username_match:
            return True
    else:
        if keyword_match:
            return True
    
    return False

def get_post_data(post):
    title = post["title"]
    text = post["selftext"]
    author = post["author"]
    url = post["url"]

    return {"title": title, "text": text, "username": author, "url": url}

@bp.route('/get', methods=['GET', 'POST'])
def reddit():
    username = request.args.get("username", None)
    keyword = request.args.get("keyword", None)

    if username is None and keyword is None:
        return ("Need to include either username or keyword", 400)
    
    url = "https://api.pushshift.io/reddit/search/submission/?subreddit=OSUOnlineCS&sort=desc&sort_type=created_utc&after=&before=&size=1000"

    page = requests.get(url)
    posts = page.json()
    matching_posts = []

    for item in posts["data"]:

        post_data = get_post_data(item)

        if parse_post(post_data, username, keyword):
            matching_posts.append( { "title": post_data["title"], "username": post_data["author"], "url": post_data["url"] } )

    response = jsonify( { "data": matching_posts } )
    return response