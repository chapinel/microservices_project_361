import functools
import requests
import time

from flask import (
    Blueprint, flash, g, redirect, request, session, jsonify
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
        post_no = 0
        for item in posts["data"]:
            title = item["title"]
            text = item["selftext"]
            author = item["author"]
            url = item["url"]
            post_data = {"title": title, "username": author, "url": url}
            if username and keyword:
                if author == username and (check_keyword(text, title, keyword)):
                    all_posts[post_no] = post_data
                    post_no += 1
            elif username:
                if author == username:
                    all_posts[post_no] = post_data
                    post_no += 1
            else:
                if (check_keyword(text, title, keyword)):
                    all_posts[post_no] = post_data
                    post_no += 1
            

        response = jsonify( { "data": all_posts } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    return (error, 500)