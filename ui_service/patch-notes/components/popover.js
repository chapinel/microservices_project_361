import React, { useEffect, useState } from "react";
import styles from '../styles/popover.module.css'

export default function Popover({open, children, options}){
    // VARIABLES
    const [componentMounted, setComponentMounted] = useState(false);
    const [openPopover, setOpenPopover] = useState(open);

    // HELPER FUNCTIONS
    useEffect(()=>{
        setComponentMounted(true)
    }, [])

    const handleClick = (e) => {
        e.stopPropagation()
        setOpenPopover(!openPopover)
    }

    if (componentMounted) {
        return(
            <div className={styles.popoverContainer}>
                {openPopover && (
                <div className={styles.popoverContent}>
                    {options.map(
                        option => 
                        <button key={option.text} className={styles.popoverOption} onClick={option.onClick}>
                            {option.text}
                        </button>
                    )}
                </div>
                )}
                <div onClick={handleClick}>
                    {children}
                </div>
            </div>
        )
    } else {
        return null;
    }
}