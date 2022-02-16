import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import styles from '../../styles/game.module.css'
import Layout from '../../components/layout'
import { withIronSessionSsr } from 'iron-session/next'
import { useEffect, useState } from 'react'
import PatchCard from '../../components/patch-card'
import useSWR from 'swr'
import Modal from '../../components/modal'
// import Panel from '../../components/panel'

// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport
export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req, query }) {
      const user = req.session.user
      const game = query.game
      const userData = []
      let url;
      let notif;
      try {
        const res = await fetch(`http://127.0.0.1:5000/auth/get-one?user=${user.username}`)
        if (res.status == 200){
          const data = await res.json()
          userData.push(data.email)
          userData.push(data.service_id)
        }
      } catch (error) {
        console.error(error)
      }

      try {
        const res = await fetch(`http://127.0.0.1:5000/mail/get-one?user=${user.username}&game=${game}`)
        if (res.status === 200){
            const data = await res.json()
            if (data.mail){
                notif = "off"
            } else {
                notif = "on"
            }
            
        }
        } catch (error) {
        console.error(error)
        }
    
        try{
            const res = await fetch(`http://127.0.0.1:5000/game/get-from-name?game=${game}`,{
                method: 'GET',
            })
            if (res.status === 200){
                const data = await res.json()
                url = data.url
        }
        } catch (error) {
            console.error(error)
        }
        
      return {
        props: {
          user: user ? user : 'not found',
          userData: userData,
          notif: notif,
          game: game,
          url: url
        },
      };
    },
    {
      cookieName: "myapp_cookiename",
      password: "bu4WtDr89exqLzkFDEvZ1nqhgQzRB1PY",
      cookieOptions: {
          secure: process.env.NODE_ENV === "production",
      }
    }
)

const fetcher = game => fetch(`http://127.0.0.1:5000/note/get?game=${game}`).then(r => r.json())

const getAllNotes = (game) => {
    const { data, error } = useSWR(game, fetcher)
    return { data: data, error: error }
  }

export default function Game ({user, userData, notif, game, url}) {
    const [searchValue, setSearchValue] = useState("")
    const [controlNotifModal, setControlNotifModal] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    // const [controlPanel, setControlPanel] = useState(false);
    // const [panelData, setPanelData] = useState([]);
    // const [componentMounted, setComponentMounted] = useState(false);

    const router = useRouter()
    if (user.user === 'not found'){
        router.push("/login")
    }

    const refreshData = () => {
        router.replace(router.asPath);
    }

    async function addUserGameNotifications(gameToNotify, user, email, service_id, notifChange) {
        let mail;
        if (notifChange === "on"){
          mail = 1
        } else {
          mail = 0
        }
        // if (mailChange === "on" && service_id == null){
        //   const formData = {
        //     name: user,
        //     email: email
        //   }
        //   try {
        //     const res = await fetch('dakota service', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)})
        //     if (res.status === 200) {
        //       const data = await res.json()
        //       try {
        //         const res = await fetch('http://127.0.0.1:5000/auth/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user, id: data.id})})
        //       } catch (error) {
        //         console.error(error)
        //       }
        //     }
        //   } catch (error) {
        //     console.error(error)
        //   }
        // }
    
        try {
          const res = await fetch('http://127.0.0.1:5000/mail/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user, game: gameToNotify, mail: mail})})
          if (res.status == 200) {
            console.log('success')
            setModalSuccess(true)
            refreshData()
          }
        } catch (error) {
          console.error(error)
        }
        setTimeout(()=>{
          setControlNotifModal(false)
          setModalSuccess(false)
        }, 1000)
        refreshData()
    }
    
    const handleSearchOnChange = (e) => {
        setSearchValue(e.target.value)
        console.log(e.target.value)
    }

    let finalList = null;
    const notes = getAllNotes(game)
    if (notes.data){
        finalList = notes.data.notes.filter(note => !(note[2].includes("This article will not be visible")))
    }

    const games = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "tft": "Teamfight Tactics",
        "rift": "Wild Rift"
    }

    

    const handleNoteClick = (url) => {
        console.log(url)
        var win = window.open(url, '_blank');
        win.focus();
    }

    const handleNotifConfirm = () => {
        addUserGameNotifications(game, user.username, userData[0], userData[1], notif)
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={utilStyle.headerWButton}>
                <h1 className={utilStyle.headingXl}>{games[game]}</h1>
                <div className={styles.headerButton}>
                  {notif == 'on' ? (
                      <button className={utilStyle.svgButton} data-tip="Tooltip for notifications" onClick={() => setControlNotifModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                      </button>
                  ):(
                    <button className={utilStyle.svgButton} data-tip="Tooltip for notifications" onClick={() => setControlNotifModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell-off"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    </button>
                  )}
                
                </div>
            </div>
            <div className={styles.search}><input onChange={handleSearchOnChange} placeholder="Search for a specific title"></input></div>
            {(!finalList) ? (<div>Loading...</div>)
            : (
              <div className={utilStyle.rowAcross}>
                {finalList.filter((note) => note[1].toLowerCase().includes(searchValue.toLowerCase())).map((note) => 
                    <PatchCard title={note[1]} date={note[6]} description={note[2]} banner={note[5]} parentUrl={url} url={note[3]} onClick={handleNoteClick}></PatchCard>
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