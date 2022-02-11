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
            refreshData()
          }
        } catch (error) {
          console.error(error)
        }
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
        setControlNotifModal(false)
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={styles.header}>
                <h1 className={utilStyle.headingXl}>{games[game]}</h1>
                <button className={utilStyle.darkBgButton} data-tip="Tooltip for notifications" onClick={() => setControlNotifModal(true)}>{`Turn ${notif} notifications`}</button>
            </div>
            <div className={styles.search}><input onChange={handleSearchOnChange} placeholder="Search for a specific title"></input></div>
            {(!finalList) ? (<div>Loading...</div>)
            : (
                finalList.filter((note) => note[1].toLowerCase().includes(searchValue.toLowerCase())).map((note) => 
                    <PatchCard title={note[1]} date={note[6]} description={note[2]} banner={note[5]} parentUrl={url} url={note[3]} onClick={handleNoteClick}></PatchCard>
                )
            )}
            <Modal
                title={`Turn ${notif} notifications`}
                open={controlNotifModal}
                onChange={() => setControlNotifModal(false)}
                onCancel={() => setControlNotifModal(false)}
                onConfirm={handleNotifConfirm}
                confirmText={`Turn ${notif}`}
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