// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export async function getUserData (username) {
  try {
    const url = process.env.DATABASE_URL + `auth/get-one?user=${username}`   
    const res = await fetch(url)
    if (res.status == 200){
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

export async function createUser({username, email, password}) {
    const formData = {
        username: username,
        email: email,
        password: password,
    }

    try {
        const url = process.env.DATABASE_URL + 'auth/add'
        const response = await fetch(url, { 
          method: 'POST', 
          headers: {'Content-Type': 'application/json',}, 
          body: JSON.stringify(formData) 
        })
        return response
    } catch (error) {
        console.log(error)
    }

}

export async function validateUser({ username, password }) {
    const formData = {
        username: username,
        password: password,
    }

    try {
        const url = process.env.DATABASE_URL + 'auth/login'
        const response = await fetch(url, { 
          method: 'POST', 
          headers: {'Content-Type': 'application/json',}, 
          body: JSON.stringify(formData) 
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export async function getUserServiceId (body) {
    const url = 'https://galac-tus.herokuapp.com/user'
    try {
      const response = await fetch(url, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(body)
      })
      if (response.status === 201) {
        const galactus = await response.json()
        return galactus
      } else {
        return 'error'
      }
    } catch (error) {
      console.error(error)
      return error
    }
  }