import React, { useEffect, useState } from "react";
import styles from '../styles/popover.module.css'

export default function Popover({open, children, onChange, options}){
    const [componentMounted, setComponentMounted] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);

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
                    {options.map(option => <button className={styles.popoverOption} onClick={option.onClick}>{option.text}</button>)}
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