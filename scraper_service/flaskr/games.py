import functools
import requests
import datetime
from bs4 import BeautifulSoup

from flask import (
    Blueprint, flash, g, redirect, request, session, jsonify
)

bp = Blueprint('games', __name__, url_prefix='/games')

def rest_parse(post, game):
    title = post["title"]
    description = post["description"]
    if post["youtube_link"] != "":
        url = post["youtube_link"]
    elif post["external_link"] != "":
        url = post["external_link"]
    else:
        url = post["url"]["url"]
    banner = post["banner"]["url"]
    date = post["date"]
    date = date[0:10]
    post_data = {"title": title, "description": description, "url": url, "game": game, "banner": banner, "date": date}
    
    requests.post('http://127.0.0.1:5000/note/add', data=post_data)

def rift_parse(post):
    title = post["title"]
    description = post["description"]
    if post["youtubeLink"] != "":
        url = post["youtubeLink"]
    elif post["externalLink"] != "":
        url = post["externalLink"]
    else:
        url = post["url"]["url"]
    banner = post["featuredImage"]["banner"]["url"]
    date = post["date"]
    post_data = {"title": title, "description": description, "url": url, "banner": banner, "date": date}

    requests.post('http://127.0.0.1:5000/note/add', data=post_data)

def json_parse(json_data, date, game):
    data = dict()

    if date is None:
        for i in range(10):
            if game == "rift":
                rift_parse(json_data[i], game)
            else:
                rest_parse(json_data[i], game)
    else:
        for article in json_data:
            # need to figure out the best way to compare these strings to make sure the dates are being registered correctly
            if datetime.strptime(article["date"]) > datetime.strptime(date):
                break
            else:
                if game == "rift":
                    rift_parse(article, game)
                else:
                    rest_parse(article, game)
    
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
            json_parse(posts["result"]["pageContext"]["data"]["articles"], date, "valorant")
        elif game == "league":
            json_parse(posts["result"]["data"]["all"]["nodes"][0]["articles"], date, "league")
        elif game == "tft":
            json_parse(posts["result"]["data"]["all"]["edges"][0]["node"]["entries"], date, "tft")
        elif game == "rift":
            json_parse(posts["result"]["data"]["allContentstackArticles"]["articles"], date, "rift")

        response = jsonify( { "success": True } )
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    return (error, 500)

# @bp.route('/get-note', methods=['GET'])
# def get_note_text():
#     url = request.args.get("url", None)
#     error = None
#     if url is None:
#         error = "url is required"
    
#     if error is None:
#         headers = {'User-Agent':'Mozilla/5.0'}
#         htmlData = requests.get(url, headers=headers)
#         soup = BeautifulSoup(htmlData.content,'lxml')
#         body = soup.select('.type-article_html')
#         if body == []:
#             body = soup.find("div", {"id": "patch-notes-container"})
#         body = str(body)
#         response = jsonify( { "html": body } )
#         response.headers.add('Access-Control-Allow-Origin', '*')
#         return response
#     return (error, 500)