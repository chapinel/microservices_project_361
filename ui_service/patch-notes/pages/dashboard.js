import Layout from '../components/layout'
import Modal from '../components/modal'
import GameCard from '../components/game-card'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/dashboard.module.css'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'

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

const getUserGames = async (username) => {
  const listOfGameIDs = []

  try {
    const url = process.env.DATABASE_URL + `mail/get-games-for-user?user=${username}`  
    const res = await fetch(url)
    if (res.status === 200){
      const data = await res.json()
      for (const relationship of data.mail) {
        listOfGameIDs.push({ id: relationship[0], notifications: relationship[2]})
      }
      return listOfGameIDs
    }
  } catch (error) {
    console.error(error)
  }
}

const getGameNameUrl = async (gameId) => {
  try {
    const url = process.env.DATABASE_URL + `game/get-from-id?game=${gameId}`
    const res = await fetch(url)
    if (res.status === 200){
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

const getGameStats = async (gameId) => {
  try {
    const url = process.env.DATABASE_URL + `note/get-latest-and-count?game=${gameId}`
    const res = await fetch(url)
    if (res.status === 200){
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.error(error)
  }
}

const getEachGame = async (listOfGames) => {
  const listOfGameData = []
  for (const game of listOfGames) {
    const { name, url } = await getGameNameUrl(game.id)
    const { banner, date, count } = await getGameStats(game.id)
    const cardData = {name: name, url: url, banner: banner, date: date, count: count, notifications: game.notifications ? "off" : "on",}
    listOfGameData.push(cardData)
  }
  return listOfGameData
}

const getGameData = async (username) => {
  const gameRelationships = await getUserGames(username)
  const gameData = await getEachGame(gameRelationships)
  return gameData
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user

    if (!user) {
      return {
        redirect : {
          destination: '/login',
          permanent: false,
        }
      }
    }

    const userData = await getUserData(user.username)
    const gameData = await getGameData(user.username)
  
    return {
      props: {
        user: user,
        userData: userData,
        data: gameData,
        count:  gameData.length,
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

export default function Home({user, data, userData, count}) {

  const router = useRouter()
  const walkthrough = router.query.walkthrough ? true : false
  console.log(walkthrough)
  
  const [controlModal, setControlModal] = useState(false)
  const [controlRemoveModal, setControlRemoveModal] = useState(false)
  const [controlNotifModal, setControlNotifModal] = useState(false)
  const [gameToRemove, setGameToRemove] = useState("")
  const [gameNotif, setGameNotif] = useState([])
  const [componentMounted, setComponentMounted] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalWalkthrough, setModalWalkthrough] = useState(walkthrough)
  const [modalWalkthroughFirstScreen, setModalWalkthroughFirstScreen]  = useState(walkthrough)
  const [modalWalkthroughSecondScreen, setModalWalkthroughSecondScreen] = useState(false)
  const [modalWalkthroughThirdScreen, setModalWalkthroughThirdScreen] = useState(false)
  const [modalWalkthroughFourthScreen, setModalWalkthroughFourthScreen] = useState(false)

  // We need a mapping of game names for our checkbox selection in the Add Game modal
  const allGames = [['valorant', 'Valorant'], ['league', 'League of Legends'], ['tft', 'Teamfight Tactics'], ['rift', 'Wild Rift']]
  const chosenGames = []

  for (const name of allGames) {
    for (const game of data) {
      if (game.name === name[0]) {
        chosenGames.push(name[1])
        break
      }
    }
  }

  // This will be how we track what games the user has selected when they go to add a game
  let gamesToAdd = []

  // We need this check to make sure that the Tooltip component loads properly
  useEffect(() => {
    setComponentMounted(true)
  }, [])

  const refreshPageData = () => {
    router.replace(router.asPath);
  }

  async function addUserGameRelationship(gamesToAdd, user) {
    for (const game of gamesToAdd){
      const formData = {
        user: user,
        game: game
      }
      try {
        const res = await fetch('api/add-user-game', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
        if (res.status === 200){
          setModalSuccess(true)
        }
      } catch(error){
        console.error(error)
      }
    }
    // wait a bit so that the user can register the success message
    setTimeout(() => {
      setControlModal(false)
      setModalSuccess(false)
      refreshPageData()
    }, 1000)
  }

  async function removeUserGameRelationship(gameToRemove, user) {
    const formData = {
      user: user,
      game: gameToRemove
    }
    try {
      const res = await fetch('api/delete-user-game', { method: 'POST', headers: {'Content-Type': 'application/json',}, body: JSON.stringify(formData) })
      if (res.status === 200) {
        setModalSuccess(true)
      } 
    } catch(error) {
        console.error(error)
    }
    setTimeout(() => {
      setControlRemoveModal(false)
      setModalSuccess(false)
      refreshPageData()
    }, 1000)
  }

  async function getFirstServiceId (user, email) {
    const formData = {
      name: user,
      email: email
    }
    try {
      const res = await fetch('/api/email', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)})
      if (res.status === 200) {
        return true
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }

  async function addUserGameNotifications(gameToNotify, user, email, service_id, mailChange) {
    let mail;
    mailChange === "on" ? mail = 1 : mail = 0
    // First, we check to see if this is the first time a user has turned on notifications
    // If it is, we need to make a call to Galactus to get a new service ID for them and update their user data in our DB
    if (mail && service_id == null){
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

  // This function gets called whenever a user checks or unchecks a game in the Add Game modal
  const handleGameAdd = (e) => {
    const game = e.target.id
    if (gamesToAdd.includes(game)){
      gamesToAdd = gamesToAdd.filter(name => name != game)
    } else {
      gamesToAdd.push(game)
    }
  }

  const handleCancel = () => {
    // reset the list of games that the user wants to add
    gamesToAdd = []
    setControlModal(false)
  }

  const handleConfirm = () => {
    if (gamesToAdd.length === 0){
      console.log('no games to add')
    } else {
      addUserGameRelationship(gamesToAdd, user.username)
    }
  }

  const handleRemove = (game) => {
    setGameToRemove(game)
    setControlRemoveModal(true)
  }

  const handleRemoveConfirm = () => {
    removeUserGameRelationship(gameToRemove, user.username)
  }

  const handleNotifications = (game, type) => {
    // "type" corresponds to whether we're turning it off or on
    setGameNotif([game, type])
    setControlNotifModal(true)
  }

  const handleNotifConfirm = () => {
    addUserGameNotifications(gameNotif[0], user.username, userData[0], userData[1], gameNotif[1])
  }

  const handleWalkthroughConfirm = () => {
    if (modalWalkthroughFirstScreen) {
      setModalWalkthroughFirstScreen(false)
      setModalWalkthroughSecondScreen(true)
    } else if (modalWalkthroughSecondScreen) {
      setModalWalkthroughSecondScreen(false)
      setModalWalkthroughThirdScreen(true)
    } else if (modalWalkthroughThirdScreen) {
      setModalWalkthroughThirdScreen(false)
      setModalWalkthroughFourthScreen(true)
    } else {
      setModalWalkthrough(false)
    }
  }

  console.log(modalWalkthrough)
  
  return (
    <>
      <Layout loggedIn={true}>
      <section>
        <div className={utilStyles.headerWButton}>
        <div className={utilStyles.headingXl}>
          <p>YOUR GAMES</p>
        </div>
          <div className={styles.headerComponent}>
            {count != 4 ? (<button className={utilStyles.buttonSecondary} onClick={() => setControlModal(true)}>Add</button>) 
            : (
              <>
            <button className={utilStyles.disabledSecondaryButton} data-tip="You've added all currently available games. Looking for another game?<br />Send us an email at developers@patchporo.com - we're always considering new titles!">Add Game</button>
            {componentMounted && <ReactTooltip effect="solid" place="bottom" multiline={true}/>}
            </>
            )}
          </div>
        </div>
        <div>
        <div className={styles.hrule}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="15" viewBox="0 0 3764 15" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M1410 15.0001L288 15V10H0V8H288V0L1410 9.80884e-05V8H1455V0L1600 1.26763e-05V8H1646V0L1791 1.26763e-05V8H2917V0L3604 6.00594e-05V8H3764V10H3604V15.0001L2917 15V10H1791V15L1646 15V10H1600V15L1455 15V10H1410V15.0001Z" fill="#37DDC9"/>
          </svg>
        </div>
        {count === 0 ? (
          <div className={utilStyles.emptyState}>Add your first game to start tracking updates!</div>
        ) : (
            <div className={utilStyles.row}>
              {data.map(game => <GameCard key={game.name} user={user.user} splash={game.banner} title={game.name} totalUpdates={game.count} date={game.date} url={game.url} notifications={game.notifications} menuOption1={handleRemove} menuOption2={handleNotifications}/>)}
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
          success={modalSuccess}
        >
          <div className={styles.modalSelection}>
            {allGames.map(name => <div key={name} className={styles.check}><label className={utilStyles.formControl} htmlFor={name}><input type="checkbox" onClick={handleGameAdd} disabled={chosenGames.includes(name[1])} id={name[0]}/>{name[1]}</label></div>)}
          </div>
          <div className={styles.modalSubtext}>Don&apos;t see what you&apos;re looking for? Send us an <a href="mailto:chapinel@oregonstate.edu?subject = New Game Request">email</a> and let us know what games you&apos;d like to track!</div>
          
        </Modal>
        <Modal
          title="Are you sure?"
          open={controlRemoveModal}
          onChange={() => setControlRemoveModal(false)}
          onCancel={() => setControlRemoveModal(false)}
          onConfirm={handleRemoveConfirm}
          confirmText="yes, i'm sure"
          success={modalSuccess}
        >
          <div className={styles.modalParagraphs}>
            <p>Removing a game from your dashboard will mean that you can&apos;t receive notifications for it until you add it back.</p>
            <p>You can add a game back to your dashboard at any time and still be able to see all previous updates.</p>
          </div>
        </Modal>
        <Modal
          title={`Turn ${gameNotif[1]} notifications`}
          open={controlNotifModal}
          onChange={() => setControlNotifModal(false)}
          onCancel={() => setControlNotifModal(false)}
          onConfirm={handleNotifConfirm}
          confirmText={`Turn ${gameNotif[1]}`}
          success={modalSuccess}
        >
          {gameNotif[1] === "on" ? (
            <>
            <p className={styles.notifInfo}>If you have notifications turned on for a game, we&apos;ll send you an email as soon as we know there&apos;s been an update!</p>
            <div className={styles.emailAddress}>
              <label>Email address</label>
              <input type="text" value={userData.email} disabled></input>
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
        <Modal
          title=""
          open={modalWalkthrough}
          onChange={() => setModalWalkthrough(false)}
          onCancel={() => setModalWalkthrough(false)}
          onConfirm={handleWalkthroughConfirm}
          confirmText={modalWalkthroughFirstScreen? "I'd Love That" : "Got It"}
          cancelText={modalWalkthroughFirstScreen? "No Thanks" : "Cancel"}
        >
          {modalWalkthroughSecondScreen && (
            <>
            <p className={styles.walkthroughHeader}>Great! You can get started in three easy steps:</p>
            <div className={styles.walkthroughInstruction}>
            <h1 className={utilStyles.headingMd}>Add a game</h1>
            <p>Add as many or as few games as you&apos;d like to your dashboard.</p>
            <div className={styles.walkthroughImg}>
                <img src="/images/addAGame.gif"/>
            </div>
            </div>
            </>
          )}
          {modalWalkthroughThirdScreen && (
              <div className={styles.walkthroughInstruction}>
              <h1 className={utilStyles.headingMd}>Click in to see more information</h1>
              <p>Click into an individual game&apos;s page to see a list of its updates</p>
              <div className={styles.walkthroughImg}>
                <img src="/images/clickIn.gif"/>
              </div>
              </div>
          )}

          {modalWalkthroughFourthScreen && (
              <div className={styles.walkthroughInstruction}>
              <h1 className={utilStyles.headingMd}>Turn on notifications to get email updates</h1>
              <p>When you have notifications turned on, we&apos;ll let you know whenever a game you&apos;re tracking posts something new!</p>
              <div className={styles.walkthroughImg}>
                <img src="/images/notifications.gif"/>
              </div>
              </div>
          )}
            
          {!modalWalkthroughSecondScreen && !modalWalkthroughThirdScreen && !modalWalkthroughFourthScreen && (
            <div className={styles.initialWalkthroughContent}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F54670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            <h1 className={utilStyles.headingMd}>Welcome!</h1>
            <p>It looks like this is your first time here - would you like a quick overview of how Patch Poro works?</p>
            </div>
          )}
          
        </Modal>
      </section>
      </Layout>
    </>
  )
}
