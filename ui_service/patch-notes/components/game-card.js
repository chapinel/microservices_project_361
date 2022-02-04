import Image from 'next/image'
import styles from './card.module.css'
import Link from 'next/link'

export default function GameCard({ empty, title, date, splash, logo, totalUpdates }) {

    const updateStat = totalUpdates ? totalUpdates : '-'
    const dateStat = date ? date : '-'

    const gameName = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "tft": "Teamfight Tactics",
        "rift": "Wild Rift"
    }

    const link = `/games/${title}`
    return (
        <>
        { empty ? (
            <div className={styles.emptyCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        ) : (
        <Link href={link}>
        <div className={styles.cardGrid}>
            <div className={styles.card}>
                <div className={styles.titleSection}>
                    <div className={styles.title}>
                        <p>{gameName[title]}</p>
                    </div>
                    <div className={styles.stat1}>
                        <p className={styles.statNum}>{dateStat}</p>
                        <p className={styles.label}>LAST UPDATED</p>
                    </div>
                    <div className={styles.stat2}>
                        <p className={styles.statNum}>{updateStat}</p>
                        <p className={styles.label}>UPDATES</p>
                    </div>
                    <div className={styles.more}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </div>
                </div>
            </div>
            <div className={styles.splashImage}>
                {splash ? (
                    <img src={splash}></img>
                ) : (
                    <Image 
                    src="/images/riot-pairedlogo-white-red-rgb.png"
                    height={170}
                    width={350}
                    alt={title}
                    />
                )
                }
            </div>
        </div>
        </Link>
        )

        }
      </>  
    )
}