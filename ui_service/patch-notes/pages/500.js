import Layout from "../components/layout";
import utilStyles from '../styles/utils.module.css';
import Link from "next/link";
import styles from '../styles/customs.module.css'

export default function Custom500() {
    return (
        <Layout loggedIn={false}>
            <div className={styles.container}>
            <h2 className={utilStyles.headingMd}>Oops...looks like the poros chewed through some essential wires.</h2>
            <p className={styles.subheading}>We&apos;d recommend heading back to the <Link href="/"><a>dashboard</a></Link> while we clean up this mess.</p>
            </div>
        </Layout>
    )
}