import utilStyles from '../styles/utils.module.css'
import styles from '../styles/settings.module.css'
import Layout from '../components/layout'
import { useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { useRouter } from 'next/router'

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req, query }) {
      const user = req.session.user
      let userEmail;
      try {
        const url = process.env.DATABASE_URL + `auth/get-one?user=${user.username}`
        const res = await fetch(url)
        if (res.status == 200){
          const data = await res.json()
          userEmail = data.email
        }
      } catch (error) {
        console.error(error)
      }
        
      return {
        props: {
          user: user ? user : 'not found',
          userEmail: userEmail,
        },
      };
    },
    {
      cookieName: process.env.COOKIE,
      password: process.env.PASSWORD,
      cookieOptions: {
          secure: process.env.NODE_ENV === "production",
      }
    }
)

export default function Settings ({user, userEmail}) {

    const [editMode, setEditMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const router = useRouter()
    
    const refreshData = () => {
        router.replace(router.asPath);
    }

    const submitUserChanges = async (e) => {
        e.preventDefault()

        setErrorMessage('')

        let name = e.currentTarget.username.value;
        let email = e.currentTarget.email.value;

        if (name === '') {
            if (email === ''){
                console.log('no changes made')
                return
            } 
        } else {
            try {
                const url = process.env.DATABASE_URL + `auth/get-one?user=${name}`
                const response = await fetch(url)
                if (response.status === 200){
                    setErrorMessage('Oops - it looks like that username is already taken. Try a different one.')
                    return
                }
            } catch (error) {
                setErrorMessage('Oops - something went wrong. Please try again.')
                console.error(error)
                return
            }

            if (email === ''){
                email = userEmail
            }

        }

        const body = {
            old: user.username,
            name: name,
            email: email,
        }

        try {
            const response = await fetch('/api/updateUser', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(body) })
            if (response.status === 200){
                refreshData()
            }
        } catch (error){
            console.error(error)
        }
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={utilStyles.headerWButton}>
                <h1 className={utilStyles.headingXl}>User Settings</h1>
                <div className={styles.headerSvg}>
                    <button className={utilStyles.svgButton} onClick={() => setEditMode(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                </div>
            </div>
            {errorMessage && (
                <div>{errorMessage}</div>
            )}
            {!editMode ? (
                <div>
                    <div className={styles.settingItem}>
                        <p className={utilStyles.headingMd}>Username</p>
                        <p>{user.username}</p>
                    </div>
                    <div>
                        <p className={utilStyles.headingMd}>Email</p>
                        <p>{userEmail}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <form onSubmit={submitUserChanges}>
                        <div className={styles.settingItem}>
                            <p className={utilStyles.headingMd}>Username</p>
                            <input type="text" name="username" placeholder={user.username}/>
                        </div>
                        <div className={styles.settingItem}>
                            <p className={utilStyles.headingMd}>Email</p>
                            <input type="text" name="email" placeholder={userEmail}/>
                        </div>
                        <div className={styles.actionButtons}>
                            <button onClick={() => setEditMode(false)} className={utilStyles.darkBgSecondaryButton}>Cancel</button>
                            <button className={utilStyles.darkBgButton} type="submit">Submit Changes</button> 
                        </div>
                    </form>
                </div>
            )}
        </section>
        </Layout>
    )
}