import React, { useEffect, useState } from "react";
import styles from '../styles/modal.module.css'
import utilstyles from '../styles/utils.module.css'

export default function Modal({open, onChange, children, onCancel, onConfirm}){
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
                            <h1>Modal Title</h1>
                            <button className={styles.modalClose} onClick={handleClose}>X</button>
                        </div>
                        <div className={styles.modalContent}>
                            {children}
                        </div>
                        <div className={styles.modalAction}>
                            <button className={utilstyles.whiteBgSecondaryButton} onClick={onCancel}>Cancel</button>
                            <button className={utilstyles.whiteBgButton} onClick={onConfirm}>Confirm</button>
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