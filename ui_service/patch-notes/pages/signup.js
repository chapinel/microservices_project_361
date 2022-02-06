import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import Logo from '../components/logo'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Signup() {

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
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            })

            if (res.status === 200){
                router.push({
                    pathname: '/dashboard',
                    query: { firstVisit: true},})
            } else {
                throw new Error (await res.text())
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                </div>
                <Form logIn={false} onSubmit={onSubmit}></Form>
            </div>
        </Layout>
    )
}