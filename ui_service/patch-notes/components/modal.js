import { useEffect, useState } from "react";
import styles from '../styles/modal.module.css'
import utilstyles from '../styles/utils.module.css'

export default function Modal({modalData, children, buttonText}){
    const [componentMounted, setComponentMounted] = useState(false);
    
    useEffect(()=>{
        setComponentMounted(true)
    }, [])

    if (componentMounted) {
        return(
            <>
            {modalData.open && (
                    <div className={styles.overlay}>
                    <div className={styles.modalBody}>
                    {modalData.success && (
                        <div className={styles.successMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#37DDC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <h1 className={styles.successText}>Success!</h1>
                        </div>
                    )}
                    {modalData.loading && (
                        <div className={styles.loadingMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.loading}>
                            <line className={styles.line1} x1="12" y1="2" x2="12" y2="6"/>
                            <line className={styles.line2} x1="12" y1="18" x2="12" y2="22"/>
                            <line className={styles.line3} x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
                            <line className={styles.line4} x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
                            <line className={styles.line5} x1="2" y1="12" x2="6" y2="12"/>
                            <line className={styles.line6} x1="18" y1="12" x2="22" y2="12"/>
                            <line className={styles.line7} x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
                            <line className={styles.line8} x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                        </svg>
                        <h1 className={styles.successText}>Loading...</h1>
                        </div>
                    )}
                    {!modalData.success && !modalData.loading && (
                        <>
                             <div className={styles.modalHeader}>
                                <h1>{modalData.title}</h1>
                                <button className={styles.modalClose} onClick={modalData.onCancel}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                             </div>
                             <div className={styles.modalContent}>
                                 {children}
                             </div>
                             <div className={styles.modalAction}>
                                <button className={utilstyles.buttonSecondary} onClick={modalData.onCancel}>{buttonText.cancelText ? buttonText.cancelText : "Cancel"}</button>
                                <button className={utilstyles.buttonPrimary} onClick={modalData.onConfirm}>{buttonText.confirmText}</button>
                            </div>
                        </>
                    )}
                    </div>
                    </div>
            )}
            </>
        )
    } else {
        return null;
    }
}