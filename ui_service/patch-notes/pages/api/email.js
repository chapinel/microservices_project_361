import { getUserServiceId } from "../../lib/user"

const addServiceId = async (body) => {
  const url = process.env.DATABASE_URL + 'auth/add-mail-id'
  try {
    const response = await fetch(url, { 
      method: 'PUT', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify(body)
    })
    if (response.status === 200){
      console.log('success')
      return response
    } else {
      console.log(response.status)
      return 'error'
    }
  } catch (error) {
    console.error(error)
    return 'error'
  }
}

export default async function helper(req, res){
    const formData = req.body
    const user = formData.name

    const galactus = await getUserServiceId(formData)
    if (galactus !== 'error'){
      const response = await addServiceId({user: user, id: galactus.id})
      if (response.status === 200){
        res.status(200).send({ done: true })
      } else {
        res.status(500).end(response.status)
      }
    } else {
      res.status(500).end(galactus)
    }
}
