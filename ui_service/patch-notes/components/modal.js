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
                    {modalData.success ? (
                        <div className={styles.successMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#37DDC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <h1 className={styles.successText}>Success!</h1>
                        </div>
                    ) : (
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
                        </>  
                    )}
                    {!modalData.success && (
                        <div className={styles.modalAction}>
                            <button className={utilstyles.buttonSecondary} onClick={modalData.onCancel}>{buttonText.cancelText ? buttonText.cancelText : "Cancel"}</button>
                            <button className={utilstyles.buttonPrimary} onClick={modalData.onConfirm}>{buttonText.confirmText}</button>
                        </div>
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