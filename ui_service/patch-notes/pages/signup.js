import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import Logo from '../components/logo'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Signup() {

    const [errorMessage, setErrorMessage] = useState("")

    const router = useRouter()

    async function onSubmit(e){
        console.log("submitting data")
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value
        }

        try {
                try {
                    const res = await fetch('/api/signup', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(body),
                    })
        
                    if (res.status === 200){
                        router.push({
                            pathname: '/login',
                            query: { firstVisit: true},})
                    } else {
                        throw new Error (await res.text())
                    }
                } catch (error) {
                    if (error.message.includes('username')) {
                        setErrorMessage('Oops - it looks like that username is already taken. Try a different one.')
                    } else {
                        setErrorMessage('Oops - something went wrong. Please try again.')
                    }
                    console.error('Error:', error)
                }
        } catch (error) {
            setErrorMessage('Oops - something went wrong. Please try again.')
            console.error(error)
            return
        }

    }
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                </div>
                <Form logIn={false} onSubmit={onSubmit} errorMessage={errorMessage}></Form>
            </div>
        </Layout>
    )
}