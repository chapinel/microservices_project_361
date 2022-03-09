import styles from '../styles/card.module.css'
import Link from 'next/link'
import Popover from './popover'
import Games from '../lib/game_data'
import {useState} from 'react'

export default function GameCard({ cardData, menuOption1, menuOption2 }) {
    const updateStat = cardData.totalUpdates ? cardData.totalUpdates : '-'
    const dateStat = cardData.date ? cardData.date : '-'

    const [controlPopover, setControlPopover] = useState(false)

    const games = Games()

    const turnOnOffNotification = (e) => {
        setControlPopover(false)
        e.stopPropagation()
        menuOption2(cardData.title, cardData.notifications)
    }

    const removeGame = (e) => {
        setControlPopover(false)
        e.stopPropagation()
        menuOption1(cardData.title)
    }

    const buttons = [
        { text: `Turn ${cardData.notifications} notifications`, onClick: turnOnOffNotification}, 
        {text: "Remove game", onClick: removeGame}
    ]

    return (
        <>
        <Link href={`/games/${cardData.title}?url=${cardData.url}`}>
        <div className={styles.cardGrid}>
            <div className={styles.card}>
                <div className={styles.titleSection}>
                    <div className={styles.title}>
                        <p>{games[cardData.title]["name"]}</p>
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
                        <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#37DDC9" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="feather feather-more-vertical">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                        </Popover>
                    </div>
                </div>
            </div>
            <div className={styles.splashImage}>
                <img src={cardData.splash}></img>
            </div>
        </div>
        </Link>
      </>  
    )
}