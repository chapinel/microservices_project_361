import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import Logo from '../components/logo'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Login() {
    const router = useRouter()

    const [errorMessage, setErrorMessage] = useState('')

    let firstVisit = false
    if (router.query.firstVisit === 'true'){
        firstVisit = true
    }

    async function onSubmit(e){
        console.log("submitting data")
        e.preventDefault()

        const body = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value
        }

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })

            if (res.status === 200){
                router.push({
                    pathname: '/dashboard',
                    query: { walkthrough: firstVisit},})
            } else if (res.status === 400) {
                const data = await res.json()
                if (data.error === 'Incorrect username.'){
                    setErrorMessage("Hmm...we couldn't find anyone by that username.")
                } else {
                    setErrorMessage("Oops - that password isn't correct.")
                }
            } else {
                throw new Error (await res.text())
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Layout>
            {router.query.firstVisit === 'true' && (<div>Account created! Log in to get started.</div>)}
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                </div>
                <Form logIn={true} onSubmit={onSubmit} errorMessage={errorMessage}></Form>
            </div>
        </Layout>
    )
}