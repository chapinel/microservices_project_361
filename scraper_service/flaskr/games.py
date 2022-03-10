import requests
import datetime

from flask import (
    Blueprint, request, jsonify
)

bp = Blueprint('games', __name__, url_prefix='/games')

json_keys = {
    "youtube": {
        "rift": "youtubeLink",
        "other": "youtube_link"
    }, 
    "external": {
        "rift": "externalLink",
        "other": "external_link"
    }, 
    "link": {
        "rift": "link",
        "other": "url"
    }
}

urls = {
        "valorant": "https://playvalorant.com/page-data/en-us/news/game-updates/page-data.json",
        "league": "https://www.leagueoflegends.com/page-data/en-us/news/game-updates/page-data.json",
        "tft": "https://teamfighttactics.leagueoflegends.com/page-data/en-us/news/page-data.json",
        "rift": "https://wildrift.leagueoflegends.com/page-data/en-us/news/page-data.json",
}

def get_url(note, type, game):
    youtube = json_keys["youtube"][type]
    external = json_keys["external"][type]
    link = json_keys["link"][type]

    if game != "valorant" and note[youtube] != "":
        url = note[youtube]
    elif note[external] != "":
        url = note[external]
    else:
        url = note[link]["url"]
    
    return url

def get_banner(note, game):
    if game == "rift":
        banner = note["featuredImage"]["banner"]["url"]
    else:
        banner = note["banner"]["url"]

    return banner

def parse_note(note, game):
    title = note["title"]
    description = note["description"]
    date = note["date"]
    date = date[0:10]
    banner = get_banner(note, game)
    if game == "rift":
        url = get_url(note, "rift", "rift")
    else:
        url = get_url(note, "other", game)
    
    post_data = {"title": title, "description": description, "url": url, "game": game, "banner": banner, "date": date}

    requests.post('https://cs-361-db-service.herokuapp.com/note/add', data=post_data)
    

def get_last_10(json_data, game):
    count = 0
    for i in range(10):
        if "This article will not be visible" in json_data[i]["description"]:
            continue
        parse_note(json_data[i], game)
        count += 1
    
    return count

def get_any_after_date(json_data, date, game):
    count = 0
    for article in json_data:
        article_date = article["date"][0:10]
        if datetime.datetime.strptime(article_date, "%Y-%m-%d") <= datetime.datetime.strptime(date, "%Y-%m-%d"):
            break
        elif "This article will not be visible" in article["description"]:
            continue
        else:
            parse_note(article, game)
            count += 1
    
    return count

def json_parse(json_data, date, game):
    if date is None:
        count = get_last_10(json_data, game)
    else:
        count = get_any_after_date(json_data, date, game)
    
    return count


def get_json_data(date, game, posts):
    count = 0

    if game == "valorant":
        count = json_parse(posts["result"]["pageContext"]["data"]["articles"], date, game)
    elif game == "league":
        count = json_parse(posts["result"]["data"]["all"]["nodes"][0]["articles"], date, game)
    elif game == "tft":
        count = json_parse(posts["result"]["data"]["all"]["edges"][0]["node"]["entries"], date, game)
    elif game == "rift":
        count = json_parse(posts["result"]["data"]["allContentstackArticles"]["articles"], date, game)
    
    return count


@bp.route('/get', methods=['GET', 'POST'])
def get_latest():
    game = request.args.get("game", None)
    date = request.args.get("date", None)
    error = None

    if game is None:
        error = "Must include a game to get updates for"

    headers = {'User-Agent': 'Mozilla/5.0'}

    if error is None:
        page = requests.get(urls[game], headers=headers)

        posts = page.json()

        count = get_json_data(date, game, posts)

        response = jsonify( { "count": count } )
        return response
    
    return (error, 500)