import utilStyles from '../styles/utils.module.css'
import styles from '../styles/settings.module.css'
import Layout from '../components/layout'
import { useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { useRouter } from 'next/router'
import { getUserData } from '../lib/user'

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req, query }) {
      const user = req.session.user

      if (!user.username) {
        return {
          redirect : {
            destination: '/login',
            permanent: false,
          }
        }
      }

      const userEmail = await getUserData(user.username)
        
      return {
        props: {
          user: user,
          userEmail: userEmail.email,
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

const checkValidUsername = async (name) => {
    try {
        const url = `/api/getUserData?user=${name}`
        const response = await fetch(url)
        if (response.status === 200){
            return 'Oops - it looks like that username is already taken. Try a different one.'
        } else if (response.status === 500) {
            return true
        }
    } catch (error) {
        console.error(error)
        return 'Oops - something went wrong. Please try again.'
    }
}

const updateUser = async (body) => {
    try {
        const response = await fetch('/api/updateUser', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/json',}, 
            body: JSON.stringify(body) 
        })
        if (response.status === 200){
            return true
        } else {
            return false
        }
    } catch (error){
        console.error(error)
        return false
    }
}

export default function Settings ({user, userEmail}) {
    //VARIABLES
    const [editMode, setEditMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // HELPER FUNCTIONS
    const router = useRouter()
    
    const refreshData = () => {
        setEditMode(false)
        router.replace(router.asPath);
    }

    const checkFormValuesEmpty = (name, email) => {
        if (name === '') {
            if (email === ''){
                setErrorMessage('You must change one or both values before submitting.')
                return false
            } 
        } else if (email == '') {
            return true
        } 
    }

    const submitUserChanges = async (e) => {
        setLoading(true)
        e.preventDefault()

        setErrorMessage('')

        let name = e.currentTarget.username.value;
        let email = e.currentTarget.email.value;

        const check = checkFormValuesEmpty(name, email)
        if (!check) {
            setLoading(false)
            return
        } else if (check === true) {
            email = userEmail
        }

        const validName = await checkValidUsername(name)

        if (validName === true) {
            const body = {
                old: user.username, name: name, email: email,
            }

            const response = await updateUser(body)
            setLoading(false)
            if(response === true){
                refreshData()
            } else {
                setErrorMessage('Oops - something went wrong. Please try again.')
            }

        } else {
            setLoading(false)
            setErrorMessage(validName)
        }
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={utilStyles.headerWButton}>
                <h1 className={utilStyles.headingXl}>User Settings</h1>
                <div className={styles.headerSvg}>
                    {!editMode && (
                        <button 
                        className={utilStyles.buttonSecondary} 
                        onClick={() => setEditMode(true)}>
                            Edit
                        </button>
                    )}
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
                        <p className={utilStyles.note}>
                            Note: changing your email will affect any game you have notifications turned on for
                        </p>
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
                        {loading ? (
                            <div className={utilStyles.loadingHeader}>Making changes...</div>
                        ) : (
                            <div className={styles.actionButtons}>
                            <button 
                            onClick={() => setEditMode(false)} 
                            className={utilStyles.buttonSecondary}>
                                Cancel
                            </button>
                            <button 
                            className={utilStyles.buttonPrimary} 
                            type="submit">
                                Submit Changes
                            </button> 
                            </div>
                        )}
                    </form>
                </div>
            )}
        </section>
        </Layout>
    )
}