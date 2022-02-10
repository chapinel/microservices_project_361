import React, { useEffect, useState } from "react";
import styles from '../styles/modal.module.css'
import utilstyles from '../styles/utils.module.css'

export default function Modal({title, open, onChange, children, onCancel, onConfirm, confirmText}){
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
                            <button className={utilstyles.whiteBgSecondaryButton} onClick={onCancel}>Cancel</button>
                            <button className={utilstyles.whiteBgButton} onClick={onConfirm}>{confirmText}</button>
                        </div>
                    </div>
                </div>
            )}
            </>
        )
    } else {
        return null;
    }
}