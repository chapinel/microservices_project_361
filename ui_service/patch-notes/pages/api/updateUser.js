import { withIronSessionApiRoute } from 'iron-session/next';
import { getUserServiceId } from '../../lib/user';

const updateUserFields = async (body) => {
  const url = process.env.DATABASE_URL + `auth/update-all`
  try {
    const response = await fetch(url, { 
      method: 'PUT', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(body)
    })
    if (response.status === 200) {
      return 'success'
    } else {
      return 'error'
    }
  } catch (error) {
    console.error(error)
    return 'error'
  }
  
}

const sendResponse = async (res, req, response) => {
  if (response === 'success') {
    req.session.user = {
      id: 230,
      username: req.body.name
    };
    await req.session.save();
    res.status(200).send({ done: true })
  } else {
    res.status(500).end(response)
  }
}

export default withIronSessionApiRoute(
async function helper(req, res){
    const data = req.body

    const galactus = await getUserServiceId({name: data.name, email: data.email})

    if (galactus === 'error'){
      res.status(500).end(galactus)
    }

    const response = await updateUserFields(
      {user: data.old, id: galactus.id, name: data.name, email: data.email}
    )
    await sendResponse(res, req, response)
},
{
    cookieName: process.env.COOKIE,
    password: process.env.PASSWORD,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}
)