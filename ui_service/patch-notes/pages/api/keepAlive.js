// function needed to keep heroku dynos active long enough to regularly check for game updates
export default async function handler(req, res) {
    const parser_url = `https://parser-service-361.herokuapp.com/games/get`
    await fetch(parser_url)
    
    const db_url = process.env.DATABASE_URL + `note/get-latest-and-count?game=1`
    await fetch(db_url)

    res.status(200).send({ done: true })
}