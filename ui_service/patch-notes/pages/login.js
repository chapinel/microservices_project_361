import { useState } from 'react'
import Router from 'next/router'
import Layout from '../components/layout'
import Logo from '../components/logo'
import Form from '../components/form'
import styles from '../styles/signup.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Signup() {
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={utilStyles.headingXl}>Patch Poro</h1>
                </div>
                <Form logIn={true}></Form>
            </div>
        </Layout>
    )
}