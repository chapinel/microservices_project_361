import functools
import requests
import time

from flask import (
    Blueprint, flash, g, redirect, request, session, jsonify
)

bp = Blueprint('reddit', __name__, url_prefix='/reddit')

@bp.route('/get', methods=['GET', 'POST'])
def reddit():
    username = request.args.get("username", None)
    keyword = request.args.get("keyword", None)
    error = None

    if username is None and keyword is None:
        error = "Need to include either username or keyword"
    
    if error is None:

        url = "https://api.pushshift.io/reddit/search/submission/?subreddit=OSUOnlineCS&sort=desc&sort_type=created_utc&after=&before=&size=1000"
        
        all_posts = dict()

        page = requests.get(url)
        posts = page.json()

        for item in posts["data"]:
            title = item["title"]
            text = item["selftext"]
            author = item["author"]
            if username and keyword:
                if author == username and (keyword in text or keyword in title):
                    all_posts[title] = {"author": author, "text": text}
            elif username:
                if author == username:
                    all_posts[title] = {"author": author, "text": text}
            else:
                if (keyword in text or keyword in title):
                    all_posts[title] = {"author": author, "text": text}

        response = jsonify( { "data": all_posts } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)