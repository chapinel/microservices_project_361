import Games from "../../lib/gameData"

const getUserFromId = async(id) => {
    const url = process.env.DATABASE_URL + `auth/get-one-id?user=${id}`
    try {
        const response = await fetch(url)
        if (response.status === 200){
            const data = await response.json()
            return data.service_id
        } else {
            return 'error'
        }
    } catch (error) {
        return 'error'
    }
}

const sendUserEmail = async (body) => {
    console.log('sendUserEmail body', body)
    const url = 'https://galac-tus.herokuapp.com/email'
    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(body)
        })
        if (response.status === 201 || response.status === 200){
            return 'success'
        } else {
            return 'error'
        }
    } catch (error) {
        console.error(error)
        return 'error'
    }
}

async function sendEmails(listOfUsers, game){
    for (const user of listOfUsers){
        
        const userServiceId = await getUserFromId(user)
        if (userServiceId === 'error') {
            return false
        }
        if (userServiceId !== null){
            const response = await sendUserEmail({id: userServiceId, game: game})
            if (response === 'success'){
                continue
            } else {
                return false
            }
        } else {
            continue
        }
    }

    return true
}

const getLatestNoteDate = async (game) => {
    const url = process.env.DATABASE_URL + `note/get-latest-and-count?game=${game}`
    try {
        const response = await fetch(url)
        if (response.status === 200){
            const data = await response.json()
            return data.date
        } else {
            return 'error'
        }
    } catch (error) {
        return 'error'
    }
}

const checkForUpdates = async (game, date) => {
    const url = `https://parser-service-361.herokuapp.com/games/get?game=${game}&date=${date}`
    try {
        const response = await fetch(url)
        if (response.status === 200) {
            const data = await response.json()
            return data.count
        } else {
            return 'error'
        }
    } catch (error) {
        return 'error'
    }
}

const getUsersForGame = async (game) => {
    const url = process.env.DATABASE_URL + `mail/get-users-for-game?game=${game}`
    try {
        const response = await fetch(url)
        if (response.status === 200){
            const data = await response.json()
            return data.users
        } else {
            return 'error'
        }
    } catch (error) {
        return 'error'
    }
}

export default async function helper(req, res){
    const games = Games()
    const game_names = Object.keys(games)
    for (const game of game_names){
        const date = await getLatestNoteDate(String(games[game].id))
        if (date === 'error'){
            res.status(500).end('get date error')
            return
        }

        const count = await checkForUpdates(games[game].dbName, date)
        if (count === 0) {
            continue
        }

        const users = await getUsersForGame(games[game].dbName)
        if (users === 'error'){
            res.status(500).end('get user error')
            return
        }

        const result = await sendEmails(users, games[game].name)
        if (result === true){
            res.status(200).send({done: true})
            return
        } else {
            res.status(500).end('send email error')
            return
        }
    }
    res.status(200).send({done: true})
    return

}