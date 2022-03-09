import { createUser } from "../../lib/user"

// code to set up user session is modeled from the examples provided by NextJs: 
// https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

const checkUsername = async (username) => {
    const url = process.env.DATABASE_URL + `auth/get-one?user=${username}`
    try {
        const response = await fetch(url)
        if (response.status === 200){
            return false
        } else {
            return true
        }
    } catch (error) {
        res.status(500).end(error.message)
    }
}

export default async function signUp(req, res) {

    const userExists = await checkUsername(req.body.username)
    if (!userExists) {
        const errorMessage = 'Oops - it looks like that username is already taken. Try a different one.'
        res.status(500).end(errorMessage) 
    }
    
    try {
        await createUser(req.body)
        res.status(200).send({ done: true })
    } catch (error) {
        console.error(error)
        res.status(500).end(error.message)
    }
    
}