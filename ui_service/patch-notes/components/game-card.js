import Image from 'next/image'
import styles from '../styles/card.module.css'
import Link from 'next/link'
import Popover from './popover'
import {useState} from 'react'

export default function GameCard({ empty, title, date, splash, notifications, totalUpdates, url, menuOption1, menuOption2}) {
    const updateStat = totalUpdates ? totalUpdates : '-'
    const dateStat = date ? date : '-'

    const [controlPopover, setControlPopover] = useState(false)

    const gameName = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "tft": "Teamfight Tactics",
        "rift": "Wild Rift"
    }

    const turnOnOffNotification = (e) => {
        setControlPopover(false)
        e.stopPropagation()
        menuOption2(title, notifications)
    }

    const removeGame = (e) => {
        setControlPopover(false)
        e.stopPropagation()
        menuOption1(title)
    }

    const buttons = [{ text: `Turn ${notifications} notifications`, onClick: turnOnOffNotification}, {text: "Remove game", onClick: removeGame}]

    return (
        <>
        { empty ? (
            <div className={styles.emptyCard}>
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
        ) : (
        <Link href={`/games/${title}?url=${url}`}>
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
                        <Popover open={controlPopover} options={buttons}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#37DDC9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className={styles.splashImage}>
                <img src={splash}></img>
            </div>
        </div>
        </Link>
        )

        }
      </>  
    )
}