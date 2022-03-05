import styles from '../styles/notifmodal.module.css'

export default function Notifications({offOrOn, email}){
    if(offOrOn === 'on') {
        return(
            <>
            <p className={styles.notifInfo}>If you have notifications turned on for a game, we&apos;ll send you an email as soon as we know there&apos;s been an update!</p>
            <div className={styles.emailAddress}>
            <label>Email address</label>
            <input type="text" value={email} disabled></input>
            </div>
            <p className={styles.emailDefault}>This is the email currently associated with your account. You can change it in user settings.</p>
            </>
        )
    } else {
        return (
            <>
            <p className={styles.notifInfo}>Are you sure? If you turn off notifications, you will no longer receive email updates.</p>
            <p className={styles.notifInfo}>You can turn notifications back on at any time.</p>
            </>
        )
    }
}