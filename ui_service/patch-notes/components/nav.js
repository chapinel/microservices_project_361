import Image from 'next/image'
import styles from '../styles/nav.module.css'
import Link from 'next/link'

export default function Nav({ }) {
    return (
        <nav>
            <div className={styles.container}>
                <Link href="/dashboard">
                    <a>HOME</a>
                </Link>
                <Link href="/dashboard">
                    <a>USERS</a>
                </Link>
            </div>
        </nav>
    )
}