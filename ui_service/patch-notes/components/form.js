import Image from 'next/image'
import styles from './form.module.css'
import Link from 'next/link'

export default function Form({ logIn, onSubmit }) {
    return (
        <div className={styles.container}>
        {!logIn ? (
            <>
            <form className={styles.formBody} onSubmit={onSubmit}>
                <div className={styles.formItem}>
                    <label>Email</label>
                    <input type="text" name="email" required/>
                </div>
                <div className={styles.formItem}>
                    <label>Username</label>
                    <input type="text" name="username" required/>
                </div>
                <div className={styles.formItem}>
                    <label>Password</label>
                    <input type="password" name="password" required/>
                </div>
                <button type="submit">Sign Me Up!</button>
            </form>
            <p>Already have an account? <a>Sign in</a></p>
            </>
        ) : (
            <>
            <form className={styles.formBody} onSubmit={onSubmit}>
                <div className={styles.formItem}>
                    <label>Username</label>
                    <input type="text" name="username" required/>
                </div>
                <div className={styles.formItem}>
                    <label>Password</label>
                    <input type="password" name="password" required/>
                </div>
            </form>
            <button>Log In</button>
            <p>Don't have an account yet? <a>Sign up</a></p>
            </>
        )}
        </div>
    )
}