import styles from '../styles/toggle.module.css'

export default function Toggle() {
    return (
        <div className={styles.container}>
            <input className={styles.toggle} id="toggle" type='checkbox'>
            </input>
            <label className={styles.toggleLabel} htmlFor="toggle">
                <span className={styles.switch}></span>
            </label>
        </div>

    )
}