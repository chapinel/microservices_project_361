
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
        const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
        console.log('galactus response', response.status)
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
            console.log('error getting user service id')
            return false
        }
        if (userServiceId !== null){
            const response = await sendUserEmail({id: userServiceId, game: game})
            if (response === 'success'){
                continue
            } else {
                console.log('error sending user email')
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
            console.log('error on fetching latest note date')
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
            console.log('error on fetching game updates')
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
        const response = await fetch(url)
        if (response.status === 200){
            const data = await response.json()
            return data.users
        } else {
            console.log('error on fetching users for game')
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
        console.log('getting latest note date')
        const date = await getLatestNoteDate(game[1])
        if (date !== 'error'){
            console.log('getting count of updates')
            const count = await checkForUpdates(game[0], date)
            if (count > 0){
                console.log('getting users for game')
                const users = await getUsersForGame(game[0])
                if (users !== 'error'){
                    console.log('sending emails')
                    const result = await sendEmails(users, game[2])
                    if (result === true){
                        res.status(200).send({done: true})
                        return
                    } else {
                        console.log('error sending emails')
                        res.status(500).end('error')
                    }
                } else {
                    res.status(500).end('error')
                }
            } else {
                continue
            }
        } else {
            res.status(500).end('error')
        } 
    }

    res.status(200).send({done: true})

}