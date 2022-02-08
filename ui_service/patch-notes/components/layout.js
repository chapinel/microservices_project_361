import Head from 'next/head'
import styles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Nav from './nav'
import Footer from './footer'
import Logo from './logo'

export const siteTitle = 'Patch Notes'

export default function Layout({ children, loggedIn }) {
  if (!loggedIn){
    return (
      <div className={styles.container}>
          <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;800;900&family=Varela+Round&display=swap" rel="stylesheet">
  
            </link>
          <meta
            name="description"
            content="Get updates for your favorite games in one location"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <div className={styles.logo}>
          <Logo/>
        </div>
        <main className={styles.content}>{children}</main>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;800;900&family=Varela+Round&display=swap" rel="stylesheet">
  
            </link>
          <meta
            name="description"
            content="Get updates for your favorite games in one location"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Nav></Nav>
        <main className={styles.content}>{children}</main>
        <Footer></Footer>
      </div>
    )
  }
}