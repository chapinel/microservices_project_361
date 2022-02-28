import functools
import requests
import datetime

from flask import (
    Blueprint, flash, g, redirect, request, session, jsonify
)

bp = Blueprint('games', __name__, url_prefix='/games')

def rest_parse(post, game):
    title = post["title"]
    description = post["description"]
    if game != "valorant" and post["youtube_link"] != "":
        url = post["youtube_link"]
    elif post["external_link"] != "":
        url = post["external_link"]
    else:
        url = post["url"]["url"]
    banner = post["banner"]["url"]
    date = post["date"]
    date = date[0:10]
    post_data = {"title": title, "description": description, "url": url, "game": game, "banner": banner, "date": date}
    
    requests.post('https://cs-361-db-service.herokuapp.com/note/add', data=post_data)

def rift_parse(post):
    title = post["title"]
    description = post["description"]
    if post["youtubeLink"] != "":
        url = post["youtubeLink"]
    elif post["externalLink"] != "":
        url = post["externalLink"]
    else:
        url = post["link"]["url"]
    banner = post["featuredImage"]["banner"]["url"]
    date = post["date"]
    date = date[0:10]
    post_data = {"title": title, "description": description, "url": url, "game": "rift", "banner": banner, "date": date}

    requests.post('https://cs-361-db-service.herokuapp.com/note/add', data=post_data)

def json_parse(json_data, date, game):
    count = 0

    if date is None:
        for i in range(10):
            if game == "rift":
                rift_parse(json_data[i])
            else:
                rest_parse(json_data[i], game)
            count += 1
    else:
        for article in json_data:
            article_date = article["date"][0:10]
            # need to figure out the best way to compare these strings to make sure the dates are being registered correctly
            if datetime.datetime.strptime(article_date, "%Y-%m-%d") <= datetime.datetime.strptime(date, "%Y-%m-%d"):
                break
            else:
                if game == "rift":
                    rift_parse(article)
                else:
                    rest_parse(article, game)
                count += 1
    
    return count


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
            count = json_parse(posts["result"]["pageContext"]["data"]["articles"], date, "valorant")
        elif game == "league":
            count = json_parse(posts["result"]["data"]["all"]["nodes"][0]["articles"], date, "league")
        elif game == "tft":
            count = json_parse(posts["result"]["data"]["all"]["edges"][0]["node"]["entries"], date, "tft")
        elif game == "rift":
            count = json_parse(posts["result"]["data"]["allContentstackArticles"]["articles"], date, "rift")

        response = jsonify( { "count": count } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    return (error, 500)