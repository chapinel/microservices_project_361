import Image from 'next/image'
import styles from './form.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Form({ logIn, onSubmit, errorMessage }) {
    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <p>With Patch Poro, quickly check to see if any of your favorite Riot Games titles have had updates posted.</p>
            </div>
            {!logIn ? (
                <>
                {errorMessage && (<div className={styles.error}>{errorMessage}</div>)}
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
                    <div className={styles.button}>
                        <button className={utilStyles.whiteBgButton} type="submit">Sign Me Up</button>
                    </div>
                </form>
                <div className={styles.switchPages}>
                    <p>Already have an account?</p>
                    <Link href="/login">
                        <a>Log in</a>
                    </Link>
                </div>
                </>
            ) : (
                <>
                {errorMessage && (<div className={styles.error}>{errorMessage}</div>)}
                <form className={styles.formBody} onSubmit={onSubmit}>
                    <div className={styles.formItem}>
                        <label>Username</label>
                        <input type="text" name="username" required/>
                    </div>
                    <div className={styles.formItem}>
                        <label>Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <div className={styles.button}>
                        <button className={utilStyles.whiteBgButton} type="submit">Log in</button>
                    </div>
                </form>
                <div className={styles.switchPages}>
                    <p>Don't have an account yet?</p>
                    <Link href="/login">
                        <a>Sign up</a>
                    </Link>
                </div>
                </>
            )}
        </div>
    )
}