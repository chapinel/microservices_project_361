import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    async function logoutRoute(req, res, session) {
        req.session.destroy();
        res.status(200).send({ done: true });
    },
    {
        cookieName: "myapp_cookiename",
        password: "bu4WtDr89exqLzkFDEvZ1nqhgQzRB1PY",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    }
);