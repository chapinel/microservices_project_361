
export default async function handler(req, res) {
    try {
        const url = process.env.DATABASE_URL + `auth/get-one?user=${req.query.user}`
        const res = await fetch(url)
        if (res.status == 200){
            const data = await res.json()
            res.status(200).send({ done: data })
        } else {
            res.status(500).end()
        }
    } catch (error) {
        console.error(error)
        res.status(500).end(error.message)
    }
}