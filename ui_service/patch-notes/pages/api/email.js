
export default async function helper(req, res){
    const formData = req.body
    const user = formData.name
    try {
        console.log('fetching galactus')
        const response = await fetch('https://galac-tus.herokuapp.com/user', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)})
        if (response.status === 201) {
          const data = await response.json()
          console.log(data)
          try {
            console.log('updating user with id')
            const response = await fetch('http://127.0.0.1:5000/auth/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user, id: data.id})})
            if (response.status === 200){
              console.log('success')
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
}
