
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
    const url = 'https://galac-tus.herokuapp.com/'
    try {
        const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
        if (response.status === 200){
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
        
        const userServiceId = getUserFromId(user)
        if (userServiceId === 'error') {
            return false
        }
        if (userServiceId !== null){
            const response = sendUserEmail({id: id, game: game})
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
        console.error(error)
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
        console.error(error)
        return 'error'
    }
}

const getUsersForGame = async (game) => {
    const url = process.env.DATABASE_URL + `mail/get-users-for-game?game=${game}`
    try {
        const response = fetch(url)
        if (response.status === 200){
            const data = await response.json()
            return data.users
        } else {
            return 'error'
        }
    } catch (error) {
        console.error(error)
        return 'error'
    }
}

export default async function helper(req, res){
    const games = [["valorant", 1, "Valorant"], ["league", 2, "League of Legends"], ["tft", 3, "Teamfight Tactics"], ["rift", 4, "Wild Rift"]]
 
    for (const game of games){
        const date = await getLatestNoteDate(game[1])
        if (date !== 'error'){
            const count = await checkForUpdates(game[1], date)
            if (count > 0){
                const users = await getUsersForGame(game[0])
                if (users !== 'error'){
                    const result = sendEmails(users, game[2])
                    if (result === true){
                        res.status(200).send({done: true})
                        res.end()
                    }
                }
            }
        }

        res.status(500).end('error')
        
    }
}