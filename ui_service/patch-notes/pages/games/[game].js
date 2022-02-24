import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import styles from '../../styles/game.module.css'
import Layout from '../../components/layout'
import { withIronSessionSsr } from 'iron-session/next'
import { useState } from 'react'
import PatchCard from '../../components/patch-card'
import Modal from '../../components/modal'

// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport
const getUserData = async (username) => {
  try {
    const url = process.env.DATABASE_URL + `auth/get-one?user=${username}`   
    const res = await fetch(url)
    if (res.status == 200){
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

const getUserGameNotifications = async (username, game) => {
  try {
    const url = process.env.DATABASE_URL + `mail/get-mail?user=${username}&game=${game}`
    const res = await fetch(url)
    if (res.status === 200){
        const data = await res.json()
        return data.mail ? "off" : "on"
    }
  } catch (error) {
  console.error(error)
  }
}

const getGameUrl = async (game) => {
  try{
    const url = process.env.DATABASE_URL + `game/get-from-name?game=${game}`
    const res = await fetch(url)
    if (res.status === 200){
        const data = await res.json()
        return data.url
  }
  } catch (error) {
      console.error(error)
  }
}

const getGameNotes = async (game) => {
  try{
    const url = process.env.DATABASE_URL + `note/get?game=${game}`
    const res = await fetch(url)
    if (res.status === 200){
      const data = await res.json()
      return data.notes
    }
  } catch (error) {
      console.error(error)
  }
}

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

      const game = query.game

      const userData = await getUserData(user.username)
      const gameNotifications = await getUserGameNotifications(user.username, game)
      const gameUrl = await getGameUrl(game)
      const notes = await getGameNotes(game)
        
      return {
        props: {
          user: user,
          userData: userData,
          notif: gameNotifications,
          game: game,
          url: gameUrl,
          notes: notes
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

export default function Game ({user, userData, notif, game, url, notes}) {
    const [searchValue, setSearchValue] = useState("")
    const [controlNotifModal, setControlNotifModal] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)

    const router = useRouter()

    const finalList = notes.filter(note => !(note.description.includes("This article will not be visible")))

    const games = {
      "valorant": "Valorant",
      "league": "League of Legends",
      "tft": "Teamfight Tactics",
      "rift": "Wild Rift"
    }

    const refreshPageData = () => {
        router.replace(router.asPath);
    }

    async function addUserGameNotifications(gameToNotify, user, email, service_id, notifChange) {
        let mail;
        notifChange === "on" ? mail = 1 : mail = 0
        
        // First, we check to see if this is the first time a user has turned on notifications
        // If it is, we need to make a call to Galactus to get a new service ID for them and update their user data in our DB
        if (mail && service_id === null){
          const response = await getFirstServiceId(user, email)
          if (!response) {
            console.log('There was an error getting and setting the service id')
            return
          }
        }
        try {
          const res = await fetch('/api/update-email', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user, game: gameToNotify, mail: mail})})
          if (res.status == 200) {
            setModalSuccess(true)
            setTimeout(() => {
              setControlNotifModal(false)
              setModalSuccess(false)
              refreshPageData()
            }, 1000)
          }
        } catch (error) {
          console.error(error)
        }
  }
    
    const handleSearchOnChange = (e) => {
        setSearchValue(e.target.value)
        console.log(e.target.value)
    }

    const handleNoteClick = (url) => {
        console.log(url)
        var win = window.open(url, '_blank');
        win.focus();
    }

    const handleNotifConfirm = () => {
        addUserGameNotifications(game, user.username, userData.email, userData.service_id, notif)
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={utilStyle.headerWButton}>
                <h1 className={utilStyle.headingXl}>{games[game]}</h1>
                <div className={styles.headerButton}>
                      <button className={utilStyle.svgButton} data-tip="Tooltip for notifications" onClick={() => setControlNotifModal(true)}>
                        {notif == 'on' ? (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F54670" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        ):( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F54670" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell-off"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        )}
                      </button>
                </div>
            </div>
            <div className={styles.hrule}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="15" viewBox="0 0 3764 15" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1410 15.0001L288 15V10H0V8H288V0L1410 9.80884e-05V8H1455V0L1600 1.26763e-05V8H1646V0L1791 1.26763e-05V8H2917V0L3604 6.00594e-05V8H3764V10H3604V15.0001L2917 15V10H1791V15L1646 15V10H1600V15L1455 15V10H1410V15.0001Z" fill="#37DDC9"/>
              </svg>
            </div>
            <div className={styles.search}><input onChange={handleSearchOnChange} placeholder="Search for a specific title"></input></div>
            {(!finalList) ? (<div>Loading...</div>)
            : (
              <div className={utilStyle.rowAcross}>
                {finalList.filter((note) => note.title.toLowerCase().includes(searchValue.toLowerCase())).map((note) => 
                    <PatchCard title={note.title} date={note.date} description={note.description} banner={note.banner} parentUrl={url} url={note.url} onClick={handleNoteClick}></PatchCard>
                )}
              </div>
            )}
            <Modal
                title={`Turn ${notif} notifications`}
                open={controlNotifModal}
                onChange={() => setControlNotifModal(false)}
                onCancel={() => setControlNotifModal(false)}
                onConfirm={handleNotifConfirm}
                confirmText={`Turn ${notif}`}
                success={modalSuccess}
                >
                {notif === "on" ? (
                    <>
                    <p className={styles.notifInfo}>If you have notifications turned on for a game, we'll send you an email as soon as we know there's been an update!</p>
                    <div className={styles.emailAddress}>
                    <label>Email address</label>
                    <input type="text" value={userData[0]} disabled></input>
                    </div>
                    <p className={styles.emailDefault}>This is the email currently associated with your account. You can change it in user settings.</p>
                    </>
                ) : (
                    <>
                    <p className={styles.notifInfo}>Are you sure? If you turn off notifications, you will no longer receive email updates.</p>
                    <p className={styles.notifInfo}>You can turn notifications back on at any time.</p>
                    </>
                )}
                
            </Modal>
            
        </section>
        </Layout>
    )
}