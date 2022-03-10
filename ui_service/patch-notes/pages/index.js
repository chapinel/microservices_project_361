import Layout from '../components/layout'
import Modal from '../components/modal'
import GameCard from '../components/game-card'
import Games from '../lib/game_data'
import Walkthrough from '../components/walkthrough'
import Notifications from '../components/notifModal'
import utilStyles from '../styles/utils.module.css'
import styles from '../styles/dashboard.module.css'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'
import { getUserData } from '../lib/user'
import { getUserGames, getGameNameUrl, getGameStats } from '../lib/get_game_info'
import { updateUserGameNotifications, addUserGame, removeUserGame } from '../lib/user_game'

// code to set up user session is modeled from the examples provided by NextJs: 
// https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

const getEachGame = async (listOfGames) => {
  const listOfGameData = []
  for (const game of listOfGames) {
    const { name, url } = await getGameNameUrl(game.id, "id")
    const { banner, date, count } = await getGameStats(game.id)
    const cardData = {
      name: name, 
      url: url, 
      banner: banner, 
      date: date, 
      count: count, 
      notifications: game.notifications ? "off" : "on",
    }
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
  // VARIABLES
  const router = useRouter()
  const walkthrough = router.query.visit === 'first' ? true : false
  
  const [controlModal, setControlModal] = useState(false)
  const [controlRemoveModal, setControlRemoveModal] = useState(false)
  const [controlNotifModal, setControlNotifModal] = useState(false)
  const [gameToRemove, setGameToRemove] = useState("")
  const [gameNotif, setGameNotif] = useState([])
  const [componentMounted, setComponentMounted] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalWalkthrough, setModalWalkthrough] = useState(walkthrough)
  const [modalWalkthroughFirstScreen, setModalWalkthroughFirstScreen]  = useState(walkthrough)
  const [modalWalkthroughSecondScreen, setModalWalkthroughSecondScreen] = useState(false)
  const [modalWalkthroughThirdScreen, setModalWalkthroughThirdScreen] = useState(false)
  const [modalWalkthroughFourthScreen, setModalWalkthroughFourthScreen] = useState(false)

  const games = Games()
  let gamesToAdd = []

  // We need this check to make sure that the Tooltip component loads properly
  useEffect(() => {
    setComponentMounted(true)
  }, [])

  // HELPER FUNCTIONS
  const refreshPageData = () => {
    router.replace(router.asPath);
  }

  const resetGamesToAdd = () => {
    gamesToAdd = []
  }

  const checkIfGameAlreadyChosen = (gameName) => {
    for (const game of data){
      if (game.name === gameName){
        return true
      }
    }
    return false
  }

  const waitForSuccessMessage = (modalFunction) => {
      setTimeout(() => {
        modalFunction(false)
        setModalSuccess(false)
        refreshPageData()
      }, 1000)
  }

  const addUserGameRelationship = async (gamesToAdd, user) => {
    setModalLoading(true)
    for (const game of gamesToAdd){
      const response = await addUserGame({user: user, game: game})
      console.log(response)
      if (response === true){
        setModalLoading(false)
        setModalSuccess(true)
        resetGamesToAdd()
        waitForSuccessMessage(setControlModal)
      } else {
        setModalLoading(false)
        console.error('error adding game')
      }
    } 
  }

  const removeUserGameRelationship = async (gameToRemove, user) => {
    setModalLoading(true)
    const response = await removeUserGame({user: user, game: gameToRemove})
    if (response === true){
      setModalLoading(false)
      setModalSuccess(true)
      waitForSuccessMessage(setControlRemoveModal)
    } else {
      setModalLoading(false)
      console.error('error removing game')
    }
  }

  const changeUserGameNotifications = async (notificationParameters) => {
    setModalLoading(true)
    const response = await updateUserGameNotifications(notificationParameters)
    if (response === true){
      setModalLoading(false)
      setModalSuccess(true)
      waitForSuccessMessage(setControlNotifModal)
    } else {
      setModalLoading(false)
      console.error('error changing notifications')
    }
  }

  const handleGameCheckUncheck = (e) => {
    const game = e.target.id
    if (gamesToAdd.includes(game)){
      gamesToAdd = gamesToAdd.filter(name => name != game)
    } else {
      gamesToAdd.push(game)
    }
  }

  const handleAddCancel = () => {
    resetGamesToAdd()
    setControlModal(false)
  }

  const handleAddConfirm = () => {
    if (gamesToAdd.length === 0){
      console.log('no games to add')
    } else {
      addUserGameRelationship(gamesToAdd, user.username)
    }
  }

  const handleClickRemove = (game) => {
    setGameToRemove(game)
    setControlRemoveModal(true)
  }

  const handleRemoveConfirm = () => {
    removeUserGameRelationship(gameToRemove, user.username)
  }

  const handleClickNotifications = (game, turnOffOrOn) => {
    setGameNotif({game: game, OffOrOn: turnOffOrOn})
    setControlNotifModal(true)
  }

  const handleNotifConfirm = () => {
    const parameters = {
      gameToNotify: gameNotif.game,
      user: user.username,
      email: userData.email,
      service_id: userData.service_id,
      mailChange: gameNotif.OffOrOn
    }
    changeUserGameNotifications(parameters)
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

  return (
    <>
      <Layout loggedIn={true}>
      <section>
        <div className={utilStyles.headerWButton}>
        <div className={utilStyles.headingXl}>
          <p>YOUR GAMES</p>
        </div>
          <div className={styles.headerComponent}>
            {count != 4 ? (
            <button 
            className={utilStyles.buttonSecondary} 
            onClick={() => setControlModal(true)}>
              Add
            </button>
            ) 
            : (
              <>
            <button 
              className={utilStyles.disabledSecondaryButton} 
              data-tip="You've added all currently available games. 
              Looking for another game?<br />
              Send us an email at chapinel@oregonstate.edu - we're always considering new titles!">
                Add Game
              </button>
            {componentMounted && <ReactTooltip effect="solid" place="bottom" multiline={true}/>}
            </>
            )}
          </div>
        </div>
        <div>
        <div className={styles.hrule}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="15" viewBox="0 0 3764 15" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" 
          d="M1410 15.0001L288 15V10H0V8H288V0L1410 9.80884e-05V8H1455V0L1600 
          1.26763e-05V8H1646V0L1791 1.26763e-05V8H2917V0L3604 
          6.00594e-05V8H3764V10H3604V15.0001L2917 15V10H1791V15L1646 15V10H1600V15L1455 15V10H1410V15.0001Z" 
          fill="#37DDC9"/>
          </svg>
        </div>
        {count === 0 ? (
          <div className={utilStyles.emptyState}>Add your first game to start tracking updates!</div>
        ) : (
            <div className={utilStyles.row}>
              {data.sort(
                function(a, b){if (a.date < b.date) return 1;if (a.date > b.date) return -1;return 0;}
                ).map(
                  game => <GameCard 
                    key={game.name} 
                    cardData={
                      { title: game.name, 
                        date: game.date, 
                        splash: game.banner, 
                        notifications: game.notifications, 
                        url: game.url, 
                        totalUpdates: game.count}
                    }
                    menuOption1={handleClickRemove} 
                    menuOption2={handleClickNotifications}
              />)}
            </div>
        )}
        </div>
        <Modal
          modalData={{
            title: "Add a game",
            open: controlModal,
            onCancel: handleAddCancel,
            onConfirm: handleAddConfirm,
            success: modalSuccess,
            loading: modalLoading,
          }}
          buttonText=
          {{
            confirmText: "Add games"
          }}
        >
          <div className={styles.modalSelection}>
            {Object.keys(games).map(
              (game, i) => 
              <div 
              key={i} 
              className={styles.check}>
                <label className={utilStyles.formControl} htmlFor={games[game].name}>
                  <input type="checkbox" onClick={handleGameCheckUncheck} disabled={checkIfGameAlreadyChosen(games[game].dbName)} 
                  id={games[game].dbName}/>
                  {games[game].name}
                </label>
              </div>
            )}
          </div>
          <div className={styles.modalSubtext}>
            Don&apos;t see what you&apos;re looking for? 
            Send us an <a href="mailto:chapinel@oregonstate.edu?subject = New Game Request">email</a> 
             and let us know what games you&apos;d like to track!
          </div>
        </Modal>
        <Modal
          modalData={{
            title: "Are you sure?",
            open: controlRemoveModal,
            onCancel: () => setControlRemoveModal(false),
            onConfirm: handleRemoveConfirm,
            success: modalSuccess,
            loading: modalLoading,
          }}
          buttonText={{
            confirmText: "yes, i'm sure"
          }}
        >
          <div className={styles.modalParagraphs}>
            <p>Removing a game from your dashboard will mean 
              that you can&apos;t receive notifications for it until you add it back.
            </p>
            <p>You can add a game back to your dashboard at any time and 
              still be able to see all previous updates.
            </p>
          </div>
        </Modal>
        <Modal
          modalData={{
            title: `Turn ${gameNotif.OffOrOn} notifications`,
            open: controlNotifModal,
            onCancel: () => setControlNotifModal(false),
            onConfirm: handleNotifConfirm,
            success: modalSuccess,
            loading: modalLoading,
          }}
          buttonText={{
            confirmText: `Turn ${gameNotif.OffOrOn}`
          }}
        >
          <Notifications offOrOn={gameNotif.OffOrOn} email={userData.email}/>
        </Modal>
        <Modal
          modalData={{
            title: "",
            open: modalWalkthrough,
            onCancel: () => setModalWalkthrough(false),
            onConfirm: handleWalkthroughConfirm,
          }}
          buttonText={{
            confirmText: modalWalkthroughFirstScreen? "I'd Love That" : "Got It",
            cancelText: modalWalkthroughFirstScreen? "No Thanks" : "Cancel"
          }}
        >
          {modalWalkthroughSecondScreen && (
            <Walkthrough screen="second" screenData={{
              mainHeader: "Great! You can get started in three easy steps:",
              heading: "Add a game", 
              description: "Add as many or as few games as you'd like to your dashboard.",
              image: "/images/addgame.gif"
            }}/>
          )}
          {modalWalkthroughThirdScreen && (
            <Walkthrough screen="third" screenData={{
              heading: "Click in to see more information", 
              description: "Click into an individual game's page to see a list of its updates",
              image: "/images/clickmore.gif"
            }}/>
          )}

          {modalWalkthroughFourthScreen && (
            <Walkthrough screen="fourth" screenData={{
              heading: "Turn on notifications to get email updates", 
              description: 
              "When you have notifications turned on, we'll let you know whenever a game you're tracking posts something new!",
              image: "/images/notifications.gif"
            }}/>
          )}
            
          {!modalWalkthroughSecondScreen && !modalWalkthroughThirdScreen && !modalWalkthroughFourthScreen && (
            <Walkthrough screen="first"/>
          )}
          
        </Modal>
      </section>
      </Layout>
    </>
  )
}
