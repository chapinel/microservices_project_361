import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

async function signUpUser(body) {
    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body),
        })
        if (res.status === 200){
            return 'success'
        } else {
            throw new Error (await res.text())
        }
    } catch (error) {
        console.error('Error:', error)
        if (error.message.includes('username')) {
            return 'Oops - it looks like that username is already taken. Try a different one.'
        } else {
            return 'error'
        }
    }
}

export default function Signup() {
    //VARIABLES
    const [errorMessage, setErrorMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    //HELPER FUNCTIONS
    const signupAttemptResponse = (response) => {
        if (response === 'success') {
            router.push({
                pathname: '/login',
                query: { firstVisit: true },})
        } else {
            setLoading(false)
            if (response.includes('username')){
                setErrorMessage(response)
            } else {
                setErrorMessage('Oops - something went wrong. Please try again.')
            }
        }
    }

    async function onSubmit(e){
        setLoading(true)
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value
        }

        const response = await signUpUser(body)
        signupAttemptResponse(response)
        
    }

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                </div>
                <Form logIn={false} onSubmit={onSubmit} errorMessage={errorMessage} loading={loading}></Form>
            </div>
        </Layout>
    )
}