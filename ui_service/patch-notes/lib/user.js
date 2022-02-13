// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export async function createUser({username, email, password}) {
    const formData = {
        username: username,
        email: email,
        password: password,
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/auth/add', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
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
        const response = await fetch('http://127.0.0.1:5000/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
        return response
    } catch (error) {
        console.log(error)
    }
}