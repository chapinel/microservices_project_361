import Layout from '../components/layout'
import Modal from '../components/modal'
import GameCard from '../components/game-card'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/dashboard.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
    const userData = []
    const listOfGameIDs = []
    const listofGameData = []
    let count = 0
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
      const res = await fetch(`http://127.0.0.1:5000/mail/get?user=${user.username}`)
      if (res.status === 200){
        const data = await res.json()
        count = data.mail.length
        for (const relationship of data.mail) {
        listOfGameIDs.push(relationship[0])
        // need to make this a tuple, with mail setting as the second part
        }
      }
    } catch (error) {
      console.error(error)
    }

    if (listOfGameIDs.length > 0) {
      for (const game of listOfGameIDs){
        const cardData = {}
        try{
          const res = await fetch(`http://127.0.0.1:5000/game/get-from-id?game=${game}`,{
            method: 'GET',
          })
          if (res.status === 200){
            const data = await res.json()
            cardData.name = data.name
            cardData.url = data.url
          }
        } catch (error) {
          console.error(error)
        }
        try {
          const res = await fetch(`http://127.0.0.1:5000/note/get-latest?game=${game}`, {
            method: 'GET',
        })
          if (res.status === 200){
            const data = await res.json()
            cardData.banner = data.banner
            cardData.date = data.date
          }
        } catch (error) {
          console.error(error)
        }
    
        try {
          const res = await fetch(`http://127.0.0.1:5000/note/get-count?game=${game}`, {
            method: 'GET',
          })
          if (res.status === 200){
            const data = await res.json()
            cardData.count = data.count
          }
        } catch (error) {
          console.error(error)
        }
    
        listofGameData.push(cardData)
      }
    }
  
    return {
      props: {
        user: user ? user : 'not found',
        userData: userData,
        data: listofGameData,
        count: count,
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



export default function Home({user, data, userData, count}) {
  const [controlModal, setControlModal] = useState(false)
  const [controlRemoveModal, setControlRemoveModal] = useState(false)
  const [controlNotifModal, setControlNotifModal] = useState(false)
  const [gameToRemove, setGameToRemove] = useState("")
  const [gameNotif, setGameNotif] = useState("")
  const [componentMounted, setComponentMounted] = useState(false)

  const router = useRouter()
  if (user.user === 'not found'){
    router.push("/login")
  }

  console.log(userData)

  useEffect(() => {
    setComponentMounted(true)
  }, [])

  const refreshData = () => {
    router.replace(router.asPath);
  }

  async function addUserGameRelationship(gamesToAdd, user) {
    for (const game of gamesToAdd){
      const formData = {
        user: user,
        game: game
      }
      try {
        const res = await fetch('http://127.0.0.1:5000/mail/add', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
        if (res.status === 200){
          refreshData()
        }
      } catch(error){
        console.error(error)
      }
    }
    setControlModal(false)
  }

  async function removeUserGameRelationship(gameToRemove, user) {
    const formData = {
      user: user,
      game: gameToRemove
    }
    try {
      const res = await fetch('http://127.0.0.1:5000/mail/delete', { method: 'DELETE', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
      if (res.status === 200) {
        refreshData()
      } 
    } catch(error) {
        console.error(error)
    }
  }

  async function addUserGameNotifications(gameToNotify, user, email, service_id, mailChange) {
    console.log(gameToNotify, user, email, service_id, mailChange)
    // if (service_id == null){
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

    // try {
    //   const res = await fetch('http://127.0.0.1:5000/mail/update', { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({user: user, game: gameToNotify, mail: mailChange})})
    //   if (res.status == 200) {
    //     console.log('success')
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const allGames = [['valorant', 'Valorant'], ['league', 'League of Legends'], ['tft', 'Teamfight Tactics'], ['rift', 'Wild Rift']]
  const chosenGames = []

  let gamesToAdd = []

  for (const name of allGames) {
    for (const game of data) {
      if (game.name === name[0]) {
        chosenGames.push(name[1])
        break
      }
    }
  }

  const handleGameAdd = (e) => {
    const game = e.target.id
    if (gamesToAdd.includes(game)){
      gamesToAdd = gamesToAdd.filter(name => name != game)
    } else {
      gamesToAdd.push(game)
    }
    console.log(gamesToAdd)
  }

  const handleCancel = () => {
    gamesToAdd = []
    setControlModal(false)
  }

  const handleConfirm = () => {
    addUserGameRelationship(gamesToAdd, user.username)
  }

  const handleRemove = (game) => {
    setGameToRemove(game)
    setControlRemoveModal(true)
  }

  const handleRemoveConfirm = () => {
    removeUserGameRelationship(gameToRemove, user.username)
    setControlRemoveModal(false)
  }

  const handleNotifications = (game) => {
    setGameNotif(game)
    setControlNotifModal(true)
  }

  const handleNotifConfirm = () => {
    addUserGameNotifications(gameNotif, user.username, userData[0], userData[1])
    setControlNotifModal(false)
  }
  
  return (
    <>
      <Layout loggedIn={true}>
      <section>
        {router.query.walkthrough === 'true' && (<div>Walkthrough goes here</div>)}
        <div className={utilStyles.headerWButton}>
        <div className={utilStyles.headingXl}>
          <p>YOUR GAMES</p>
        </div>
        {count != 4 ? (
          <button className={utilStyles.darkBgButton} onClick={() => setControlModal(true)}>Add Game</button>
        ) : (
        <>
        <button className={utilStyles.darkBgButtonDisabled} data-tip="You've added all currently available games. Looking for another game?<br />Send us an email at developers@patchporo.com - we're always considering new titles!">Add Game</button>
        {componentMounted && <ReactTooltip effect="solid" place="bottom" multiline={true}/>}
        </>)}
        </div>
        <div>
        {count === 0 ? (
          <div className={utilStyles.emptyState}>Add your first game to start tracking updates!</div>
        ) : (
            <div className={utilStyles.row}>
              {/* need to add a prop for notifications on or off after adding notifications to game data */}
              {data.map(game => <GameCard user={user.user} splash={game.banner} title={game.name} totalUpdates={game.count} date={game.date} url={game.url} menuOption1={handleRemove} menuOption2={handleNotifications}/>)}
            </div>
        )}
        </div>
        <Modal
          title="Add a game"
          open={controlModal} 
          onChange={() => setControlModal(false)}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          confirmText="Add games"
        >
          <div className={styles.modalSelection}>
            {allGames.map(name => <div className={styles.check}><input type="checkbox" onClick={handleGameAdd} disabled={chosenGames.includes(name[1])} id={name[0]}/><label htmlFor={name}>{name[1]}</label></div>)}
          </div>
          
        </Modal>
        <Modal
          title="Are you sure?"
          open={controlRemoveModal}
          onChange={() => setControlRemoveModal(false)}
          onCancel={() => setControlRemoveModal(false)}
          onConfirm={handleRemoveConfirm}
          confirmText="yes, i'm sure"
        >
          <div className={styles.modalParagraphs}>
            <p>Removing a game from your dashboard will mean that you can't receive notifications for it until you add it back.</p>
            <p>You can add a game back to your dashboard at any time and still be able to see all previous updates.</p>
          </div>
        </Modal>
        <Modal
          title="Turn on notifications"
          open={controlNotifModal}
          onChange={() => setControlNotifModal(false)}
          onCancel={() => setControlNotifModal(false)}
          onConfirm={handleNotifConfirm}
          confirmText="Turn On"
        >
          <p className={styles.notifInfo}>If you have notifications turned on for a game, we'll send you an email as soon as we know there's been an update!</p>
          <div className={styles.emailAddress}>
            <label>Email address</label>
            <input type="text" value={userData[0]} disabled></input>
          </div>
          <p className={styles.emailDefault}>This is the email currently associated with your account. You can change it in user settings.</p>
        </Modal>
      </section>
    </Layout>
    </>
  )
}