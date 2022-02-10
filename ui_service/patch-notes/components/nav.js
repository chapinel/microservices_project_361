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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Link>
            </div>
        </nav>
    )
}