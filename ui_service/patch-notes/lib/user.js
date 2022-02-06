

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
        "username": username,
        "password": password,
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/auth/login', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded',}, body: formData })
        return response
    } catch (error) {
        console.log(error)
    }
}