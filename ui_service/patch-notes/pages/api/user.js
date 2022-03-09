import { withIronSessionApiRoute } from "iron-session/next";

// code to set up user session is modeled from the examples provided by NextJs: 
// https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export default withIronSessionApiRoute(
    function userRoute(req, res) {
        res.send({ user: req.session.user })
    },
    {
        cookieName: process.env.COOKIE,
        password: process.env.PASSWORD,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    }
)