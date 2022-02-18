import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    async function logoutRoute(req, res, session) {
        req.session.destroy();
        res.status(200).send({ done: true });
    },
    {
        cookieName: process.env.COOKIE,
        password: process.env.PASSWORD,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    }
);