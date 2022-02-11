import styles from '../styles/panel.module.css'
import utilStyles from '../styles/utils.module.css'
import { useState } from 'react'
import parse from 'html-react-parser'

export default function Panel({open, data, noteData, handleClose}){
    const [controlOpen, setControlOpen] = useState(open)
    
    console.log(data)
    // data 0 = banner, data[1] = title, data[2] = date, data[3] = url
    return (
        <>
        {open && (
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <img src={data[0]}></img>
                            <div className={styles.headerTitle}>
                                <p>{data[2]}</p>
                                <h1 className={utilStyles.headingLg}>{data[1]}</h1>
                            </div>
                        </div>
                        <div className={styles.text}>
                            {data.length > 4 && parse(data[4])}
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}