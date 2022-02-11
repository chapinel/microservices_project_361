import Image from 'next/image'
import styles from '../styles/patch.module.css'


export default function PatchCard({banner, title, description, date, parentUrl, url, onClick}) {

    let noteUrl; 
    if (url.includes("youtube") || url.includes("https")) {
        noteUrl = url
    } else {
        noteUrl = parentUrl+url
    }

    const handlePanel = () => {
        console.log(noteUrl);
        onClick(noteUrl)
    }

    return (
        <div className={styles.container} onClick={handlePanel}>
            <div className={styles.image}>
                <img src={banner}></img>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.content}>
                <div className={styles.title}>{title}</div>
                <div className={styles.date}>{date}</div>
                <div className={styles.description}>{description}</div>
            </div>
        </div>
    )
}