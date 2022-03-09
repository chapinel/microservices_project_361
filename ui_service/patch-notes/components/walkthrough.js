import styles from '../styles/walkthrough.module.css'
import utilStyles from '../styles/utils.module.css'

export default function Walkthrough({screen, screenData}){
    if(screen === 'first') {
        return(
            <div className={styles.initialWalkthroughContent}>
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#F54670" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="feather feather-map">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/>
                <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            <h1 className={utilStyles.headingMd}>Welcome!</h1>
            <p>It looks like this is your first time here - would you like a quick overview of how Patch Poro works?</p>
            </div>
        )
    } else {
        return (
            <>
            {screenData.mainHeader && (
            <p className={styles.walkthroughHeader}>Great! You can get started in three easy steps:</p>
            )}
            <div className={styles.walkthroughInstruction}>
            <h1 className={utilStyles.headingMd}>{screenData.heading}</h1>
            <p>{screenData.description}</p>
            <div className={styles.walkthroughImg}>
            <img src={screenData.image}/>
            </div>
            </div>
            </>
        )
    }
}