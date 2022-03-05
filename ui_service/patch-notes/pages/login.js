import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

async function attemptLogin(body) {
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })

        if (res.status === 200){
            return 'success'
        } else if (res.status === 400) {
            const data = await res.json()
            console.log(data.error)
            if (data.error === 'Incorrect username'){
                return "Hmm...we couldn't find anyone by that username."
            } else {
                return "Oops - that password isn't correct."
            }
        }
    } catch (error) {
        return error
    }
}

export default function Login() {
    const router = useRouter()

    const [errorMessage, setErrorMessage] = useState('')

    let firstVisit = 'return'
    if (router.query.firstVisit === 'true'){
        firstVisit = 'first'
    }

    const loginAttemptResponse = (response) => {
        if (response === 'success') {
            router.push({
                pathname: '/',
                query: { visit: firstVisit },})
        } else {
            if (typeof response === "string" && (response.includes('username') || response.includes('password'))){
                setErrorMessage(response)
            } else {
                setErrorMessage('Oops - something went wrong. Please try again.')
            }
        }
    }

    const onSubmit = async(e) => {
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value
        }

        const response = await attemptLogin(body)
        loginAttemptResponse(response)
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                    {router.query.firstVisit === 'true' && (<div className={styles.successMessage}>Account created! Log in to get started.</div>)}
                </div>
                <Form logIn={true} onSubmit={onSubmit} errorMessage={errorMessage}></Form>
            </div>
        </Layout>
    )
}