import functools
import requests
import datetime

from flask import (
    Blueprint, flash, g, redirect, request, session, jsonify
)

bp = Blueprint('games', __name__, url_prefix='/games')

def rest_parse(post):
    title = post["title"]
    description = post["description"]
    url = post["url"]["url"]
    banner = post["banner"]["url"]
    date = post["date"]
    date = date[0:10]
    post_data = {"title": title, "description": description, "url": url, "banner": banner, "date": date}
    return post_data

def rift_parse(post):
    title = post["title"]
    description = post["description"]
    url = post["link"]["url"]
    banner = post["featuredImage"]["banner"]["url"]
    date = post["date"]
    post_data = {"title": title, "description": description, "url": url, "banner": banner, "date": date}
    return post_data

def json_parse(json_data, date, rift):
    data = dict()

    if date is None:
        for i in range(10):
            if rift:
                post = rift_parse(json_data[i])
            else:
                post = rest_parse(json_data[i])
            data[post["title"]] = {"description": post["description"], "url": post["url"], "banner": post["banner"], "date": post["date"]}
    else:
        for article in json_data:
            # need to figure out the best way to compare these strings to make sure the dates are being registered correctly
            if datetime.strptime(article["date"]) > datetime.strptime(date):
                break
            else:
                if rift:
                    post = rift_parse(article)
                else:
                    post = rest_parse(article)
                data[post["title"]] = {"description": post["description"], "url": post["url"], "banner": post["banner"], "date": post["date"]}
    
    return data


@bp.route('/get', methods=['GET', 'POST'])
def get_latest():
    game = request.args.get("game", None)
    date = request.args.get("date", None)
    urls = {
        "valorant": "https://playvalorant.com/page-data/en-us/news/game-updates/page-data.json",
        "league": "https://www.leagueoflegends.com/page-data/en-us/news/game-updates/page-data.json",
        "tft": "https://teamfighttactics.leagueoflegends.com/page-data/en-us/news/page-data.json",
        "rift": "https://wildrift.leagueoflegends.com/page-data/en-us/news/page-data.json",
    }
    error = None

    if game is None:
        error = "Must include a game to get updates for"

    headers = {'User-Agent': 'Mozilla/5.0'}

    if error is None:
        page = requests.get(urls[game], headers=headers)

        posts = page.json()

        if game == "valorant":
            data = json_parse(posts["result"]["pageContext"]["data"]["articles"], date, False)
        elif game == "league":
            data = json_parse(posts["result"]["data"]["all"]["nodes"][0]["articles"], date, False)
        elif game == "tft":
            data = json_parse(posts["result"]["data"]["all"]["edges"][0]["node"]["entries"], date, False)
        elif game == "rift":
            data = json_parse(posts["result"]["data"]["allContentstackArticles"]["articles"], date, True)

        response = jsonify( { "data": data } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    return (error, 500)



