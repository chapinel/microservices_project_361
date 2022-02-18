import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
async function helper(req, res){
    const data = req.body

    try {
        console.log('fetching galactus')
        const response = await fetch('https://galac-tus.herokuapp.com/user', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: data.name, email: data.email})})
        if (response.status === 201) {
          const galactus = await response.json()
          console.log(galactus)
          try {
            console.log('updating user with id')
            const response = await fetch('http://127.0.0.1:5000/auth/update-all', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: data.old, id: galactus.id, name: data.name, email: data.email})})
            if (response.status === 200){
              console.log('success')
                req.session.user = {
                    id: 230,
                    username: req.body.name
                };
                await req.session.save();
                res.status(200).send({ done: true })
            } else {
                console.log(response.status)
            }
          } catch (error) {
            console.log('error on auth update')
            res.status(500).end(error.message)
          }
        } else {
            console.log(response.status)
        }
      } catch (error) {
        console.log('error on galactus')
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