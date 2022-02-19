import { createUser } from "../../lib/user"

// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export default async function signUp(req, res) {
    const url = process.env.DATABASE_URL + `auth/get-one?user=${req.body.username}`
    try {
        const response = await fetch(url)
        if (response.status === 200){
            const errorMessage = 'Oops - it looks like that username is already taken. Try a different one.'
            res.status(500).end(errorMessage)
        } else {
            try {
                await createUser(req.body)
                res.status(200).send({ done: true })
            } catch (error) {
                console.error(error)
                res.status(500).end(error.message)
            }
        }
    } catch(error){
        res.status(500).end(error.message) 
    }
    
}