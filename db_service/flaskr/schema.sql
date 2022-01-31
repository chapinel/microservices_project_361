DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS users_games;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    service_id TEXT UNIQUE
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    url TEXT UNIQUE NOT NULL
);

CREATE TABLE users_games (
    game_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    mail INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (game_id) REFERENCES game(id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    PRIMARY KEY (game_id, user_id)
);

CREATE TABLE note (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT "Click to read more" NOT NULL,
    url TEXT NOT NULL,
    game INTEGER NOT NULL,
    banner TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY (game) REFERENCES game(id)
);