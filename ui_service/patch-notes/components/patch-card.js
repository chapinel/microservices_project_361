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
            <div className={styles.content}>
                <div className={styles.date}>{date}</div>
                <div className={styles.title}>{title}</div>
                <div className={styles.hrule}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="15" viewBox="0 0 3764 15" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M1410 15.0001L288 15V10H0V8H288V0L1410 9.80884e-05V8H1455V0L1600 1.26763e-05V8H1646V0L1791 1.26763e-05V8H2917V0L3604 6.00594e-05V8H3764V10H3604V15.0001L2917 15V10H1791V15L1646 15V10H1600V15L1455 15V10H1410V15.0001Z" fill="#37DDC9"/>
                </svg>
                </div>
                <div className={styles.description}>{description}</div>
            </div>
        </div>
    )
}