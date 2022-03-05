import styles from '../styles/form.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Form({ logIn, onSubmit, errorMessage }) {
    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <p>With Patch Poro, quickly check to see if any of your favorite Riot Games titles have had updates posted.</p>
            </div>
                <>
                {errorMessage && (<div className={styles.error}>{errorMessage}</div>)}
                <form className={styles.formBody} onSubmit={onSubmit}>
                {!logIn && (
                    <div className={styles.formItem}>
                        <label>Email</label>
                        <input type="text" name="email" required/>
                    </div>
                )}
                    <div className={styles.formItem}>
                        <label>Username</label>
                        <input type="text" name="username" required/>
                    </div>
                    <div className={styles.formItem}>
                        <label>Password</label>
                        <input type="password" name="password" required/>
                    </div>
                    <div className={styles.button}>
                        {!logIn ? (<button className={utilStyles.buttonPrimary} type="submit">Sign Me Up</button>) :
                        (<button className={utilStyles.buttonPrimary} type="submit">Log in</button>)}
                    </div>
                </form>
                <div className={styles.switchPages}>
                    {!logIn ? (
                        <>
                        <p>Already have an account?</p>
                        <Link href="/login">
                            <a>Log in</a>
                        </Link>
                        </>
                    ) : (
                        <>
                        <p>Don&apos;t have an account yet?</p>
                        <Link href="/signup">
                            <a>Sign up</a>
                        </Link>
                        </>
                    )}
                </div>
                </>
            </div>
    )
}