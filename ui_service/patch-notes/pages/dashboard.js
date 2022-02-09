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
    const listOfGameIDs = []
    const listofGameData = []
    let count = 0
    try {
      const res = await fetch(`http://127.0.0.1:5000/mail/get?user=${user.username}`)
      if (res.status === 200){
        const data = await res.json()
        count = data.mail.length
        for (const relationship of data.mail) {
        listOfGameIDs.push(relationship[0])
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

export default function Home({user, data, count}) {
  const [controlModal, setControlModal] = useState(false)
  const [componentMounted, setComponentMounted] = useState(false);

  const router = useRouter()
  if (user.user === 'not found'){
    router.push("/login")
  }

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
    removeUserGameRelationship(game, user.username)
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
              {data.map(game => <GameCard user={user.user} splash={game.banner} title={game.name} totalUpdates={game.count} date={game.date} url={game.url} refreshData={handleRemove}/>)}
            </div>
        )}
        </div>
        <Modal
          open={controlModal} 
          onChange={() => setControlModal(false)}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        >
          <div className={styles.modalSelection}>
            {allGames.map(name => <div className={styles.check}><input type="checkbox" onClick={handleGameAdd} disabled={chosenGames.includes(name[1])} id={name[0]}/><label htmlFor={name}>{name[1]}</label></div>)}
          </div>
          
        </Modal>
      </section>
    </Layout>
    </>
  )
}