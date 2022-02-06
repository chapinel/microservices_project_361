import { validateUser } from "../../lib/user"

export default async function logIn(req, res) {
    try {
        const response = await validateUser(req.body)
        const data = await response.json()
        if (response.status === 400){
            res.status(400).send({error: data.error})
        }
        res.status(200).send({ done: true })
    } catch (error) {
        console.error(error)
        res.status(500).end(error.emssage)
    }
}