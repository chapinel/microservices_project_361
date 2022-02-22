import { validateUser } from "../../lib/user";
import { withIronSessionApiRoute } from 'iron-session/next';

// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export default withIronSessionApiRoute(
    async function loginRoute(req, res) {
        try {
            const response = await validateUser(req.body)
            const data = await response.json()
            if (response.status === 200){
                req.session.user = {
                    id: 230,
                    username: req.body.username
                };
                await req.session.save();
                res.status(200).send({ done: true })
            } else {
                res.status(400).send({error: data.error})
            }
        } catch (error) {
            console.error(error)
            res.status(500).end(error.message)
        }
    },
    {
        cookieName: process.env.COOKIE,
        password: process.env.PASSWORD,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    }
)