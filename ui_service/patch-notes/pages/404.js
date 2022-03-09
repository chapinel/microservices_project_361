import Layout from "../components/layout";
import utilStyles from '../styles/utils.module.css';
import Link from "next/link";
import styles from '../styles/customs.module.css'

export default function Custom404() {
    return (
        <Layout loggedIn={false}>
            <div className={styles.container}>
            <h2 className={utilStyles.headingMd}>Hm...we can&apos;t seem to find that page.</h2>
            <p className={styles.subheading}>
                We&apos;ll send some poros out to look for it. 
                In the meantime, we&apos;d recommend heading back to the <Link href="/"><a>dashboard</a></Link>.
            </p>
            </div>
        </Layout>
    )
}