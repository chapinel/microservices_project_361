
export default async function handler(req, res) {
    try {
        const url = process.env.DATABASE_URL + 'mail/delete'
        const res = await fetch(url, { method: 'DELETE', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(req.body) })
        if (res.status === 200){
            res.status(200).send({ done: true })
        }
    } catch (error) {
        console.error(error)
        res.status(500).end(error.message)
    }
}