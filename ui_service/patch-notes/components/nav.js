import styles from '../styles/nav.module.css'
import Link from 'next/link'
import Popover from './popover'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Nav({ }) {
    const [controlPopover, setControlPopover] = useState(false)

    const router = useRouter()

    const goToSettings = (e) => {
        setControlPopover(false)
        e.stopPropagation()
        router.push('/settings')
    }

    const logOutUser = async (e) => {
        setControlPopover(false)
        e.stopPropagation()
        try {   
           const response = await fetch('/api/logout', { method: 'POST' })
           if (response.status === 200){
               router.push('/login')
           } else {
               console.log(response)
           }
        } catch (error) {
            console.error(error)
        }
    }

    const buttons = [{ text: "User Settings", onClick: goToSettings}, {text: "Log Out", onClick: logOutUser}]

    return (
        <nav>
            <div className={styles.container}>
                <Link href="/">
                    <a>HOME</a>
                </Link>
                <div className={styles.userIcon}>
                <Popover open={controlPopover} options={buttons}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F54670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </Popover>
                </div>
            </div>
        </nav>
    )
}