export async function getUserGames (username) {
    const listOfGameIDs = []
  
    try {
      const url = process.env.DATABASE_URL + `mail/get-games-for-user?user=${username}`  
      const res = await fetch(url)
      if (res.status === 200){
        const data = await res.json()
        for (const relationship of data.mail) {
          listOfGameIDs.push({ id: relationship[0], notifications: relationship[2]})
        }
        return listOfGameIDs
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  export async function getGameNameUrl (gameIdOrName, type) {
    try {
        let url;
        if (type === "id"){
            url = process.env.DATABASE_URL + `game/get-from-id?game=${gameIdOrName}`
        } else {
            url = process.env.DATABASE_URL + `game/get-from-name?game=${gameIdOrName}`
        }
      const res = await fetch(url)
      if (res.status === 200){
        const data = await res.json()
        return data
      }
    } catch (error) {
      console.error(error)
    }
  }

  export async function getGameNameUrlFromName (gameId) {
    try {
      const url = process.env.DATABASE_URL + `game/get-from-id?game=${gameId}`
      const res = await fetch(url)
      if (res.status === 200){
        const data = await res.json()
        return data
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  export async function getGameStats (gameId) {
    try {
      const url = process.env.DATABASE_URL + `note/get-latest-and-count?game=${gameId}`
      const res = await fetch(url)
      if (res.status === 200){
        const data = await res.json()
        return data
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  export async function getUserGameNotifications (username, game) {
    try {
      const url = process.env.DATABASE_URL + `mail/get-mail?user=${username}&game=${game}`
      const res = await fetch(url)
      if (res.status === 200){
          const data = await res.json()
          return data.mail ? "off" : "on"
      }
    } catch (error) {
    console.error(error)
    }
  }

  export async function getGameNotes (game) {
    try{
      const url = process.env.DATABASE_URL + `note/get?game=${game}`
      const res = await fetch(url)
      if (res.status === 200){
        const data = await res.json()
        return data.notes
      }
    } catch (error) {
        console.error(error)
    }
  }