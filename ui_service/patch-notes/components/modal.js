import React, { useEffect, useState } from "react";
import styles from '../styles/modal.module.css'
import utilstyles from '../styles/utils.module.css'

export default function Modal({title, open, onChange, children, onCancel, onConfirm, confirmText, cancelText, success}){
    const [componentMounted, setComponentMounted] = useState(false);
    
    useEffect(()=>{
        setComponentMounted(true)
    }, [])

    const handleClose = (e) => {
        e.preventDefault();
        onChange();
    }

    if (componentMounted) {
        return(
            <>
            {open && (
                success ? (
                    <div className={styles.overlay}>
                    <div className={styles.modalBody}>
                        <div className={styles.successMessage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e9475d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <h1 className={styles.successText}>Success!</h1>
                        </div>
                    </div>
                    </div>
                ) : (
                    <div className={styles.overlay}>
                    <div className={styles.modalBody}>
                        <div className={styles.modalHeader}>
                            <h1>{title}</h1>
                            <button className={styles.modalClose} onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            {children}
                        </div>
                        <div className={styles.modalAction}>
                            <button className={utilstyles.whiteBgSecondaryButton} onClick={onCancel}>{cancelText ? cancelText : "Cancel"}</button>
                            <button className={utilstyles.whiteBgButton} onClick={onConfirm}>{confirmText}</button>
                        </div>
                    </div>
                    </div>
                )
            )}
            </>
        )
    } else {
        return null;
    }
}