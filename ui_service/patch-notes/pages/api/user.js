import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
    function userRoute(req, res) {
        res.send({ user: req.session.user })
    },
    {
        cookieName: "myapp_cookiename",
        password: "bu4WtDr89exqLzkFDEvZ1nqhgQzRB1PY",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        }
    }
)