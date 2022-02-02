import Image from 'next/image'
import styles from './nav.module.css'
import Link from 'next/link'

export default function Nav({ }) {
    return (
        <nav>
            <div className={styles.container}>
                <Link href="/index">
                    <a>HOME</a>
                </Link>
                <Link href="/index">
                    <a>USERS</a>
                </Link>
            </div>
        </nav>
    )
}