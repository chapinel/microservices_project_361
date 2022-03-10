
export default async function handler(req, res) {
    try {
        const url = process.env.DATABASE_URL + 'mail/update'
        const response = await fetch(url, { 
            method: 'PUT', 
            headers: {'Content-Type': 'application/json',}, 
            body: JSON.stringify(req.body) 
        })
        if (response.status === 200){
            res.status(200).send({ done: true })
        } else {
            res.status(500).end('error updating')
        }
    } catch (error) {
        console.error(error)
        res.status(500).end(error.message)
    }
}