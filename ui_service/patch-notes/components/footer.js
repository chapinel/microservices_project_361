import Image from 'next/image'
import styles from '../styles/footer.module.css'
import Link from 'next/link'

export default function Footer({ }) {
    return (
        <div>
            <div className={styles.container}>
            <p>Patch Poro isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
            </div>
        </div>
    )
}