import Image from 'next/image'
import styles from '../styles/patch.module.css'
import Link from 'next/link'
import {useState} from 'react'

export default function PatchCard({banner, title, description, date}) {
    return (
        <div className={styles.container}>
            <div className={styles.image}>
                <img src={banner}></img>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.content}>
                <div className={styles.title}>{title}</div>
                <div className={styles.date}>{date}</div>
                <div className={styles.description}>{description}</div>
            </div>
        </div>
    )
}