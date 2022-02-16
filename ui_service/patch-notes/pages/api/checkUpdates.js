
async function sendEmails(listOfUsers, game){
    for (const user of listOfUsers){
        try {
            const response = await fetch(`http://127.0.0.1:5000/auth/get-one-id?user=${user}`, {
                method: 'GET',
            })
            if (response.status === 200){
                const data = await response.json()
                const id = data.service_id
                if (id !== null) {
                try {
                    const response = await fetch(`https://galac-tus.herokuapp.com/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: id, game: game})})
                    if (response.status === 200){
                        continue
                    }
                } catch (error) {
                    console.log('error on galactus')
                    return false
                }
                } else {
                    continue
                }
            } else {
                return false
            }
        } catch (error) {
            console.log('error on getting user service id')
            return false
        }
    }
    return true
}

export default async function helper(req, res){
    // const games = [["valorant", 2, "Valorant"], ["league", 3, "League of Legends"], ["tft", 4, "Teamfight Tactics"], ["rift", 5, "Wild Rift"]]
    const games = [["valorant", 2, "Valorant"], ["league", 3, "League of Legends"]]
    for (const game of games){
        
        try {
            const response = await fetch(`http://127.0.0.1:5000/note/get-latest?game=${game[1]}`, {
              method: 'GET',
            })
            if (response.status === 200){
              const data = await response.json()
              const date = data.date

              try {
                const response = await fetch(`http://127.0.0.1:5001/games/get?game=${game[0]}&date=${date}`, {
                    method: 'GET',
                })
                if (response.status === 200){
                    const data = await response.json()
                    if (data.count > 0){
                       try {
                           const response = await fetch(`http://127.0.0.1:5000/mail/get-users?game=${game[0]}`, {
                            method: 'GET',
                        })
                            if (response.status === 200){
                                const data = await response.json()
                                const users = data.mail
                                const result = sendEmails(users, game[2])
                                if (result) {
                                    res.status(200).send({done: true})
                                    return res.end()
                                } else {
                                    res.status(500).end(result)
                                }
                            } else {
                                res.status(500).end(error.message)
                            }
                       } catch (error){
                        console.log('error on getting user data')
                        res.status(500).end(error.message)
                       }
                    } else {
                        res.status(200).send({done: 'no updates found'})
                        return res.end()
                    }
                } else {
                    res.status(500).end(error.message)
                }
              } catch (error){
                console.log('error on getting game updates')
                res.status(500).end(error.message)
              }
            } else {
                res.status(500).end(error.message)
            }
        } catch (error) {
            console.log('error on getting game info')
            res.status(500).end(error.message)
        }
    }

}