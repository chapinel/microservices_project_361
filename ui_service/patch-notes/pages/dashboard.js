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

  const allGames = ['valorant', 'league', 'tft', 'rift']
  const chosenGames = []

  for (const name of allGames) {
    for (const game of data) {
      if (game.name === name) {
        chosenGames.push(name)
        break
      }
    }
  }

  console.log(chosenGames)

  console.log(data)
  console.log(user)
  console.log(count)
  const router = useRouter()
  if (user.user === 'not found'){
    router.push("/login")
  }

  useEffect(() => {
    setComponentMounted(true)
    ReactTooltip.rebuild()
  }, [])
  
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
              {data.map(game => <GameCard user={user.user} splash={game.banner} title={game.name} totalUpdates={game.count} date={game.date} url={game.url}/>)}
            </div>
        )}
        </div>
        <Modal
          open={controlModal} 
          onChange={() => setControlModal(false)}
        >
          <div className={styles.modalSelection}>
            {chosenGames.includes('valorant') ? (
            <><input type="checkbox" disabled id='valorant'/><label htmlFor='valorant'>Valorant</label></>
            ) : (
            <><input type="checkbox" id='valorant'/><label htmlFor='valorant'>Valorant</label></>
            )}
            <input type="checkbox" id='league'/><label htmlFor='league'>League of Legends</label>
            <input type="checkbox" id='tft'/><label htmlFor='tft'>Teamfight Tactics</label>
            <input type="checkbox" id='rift'/><label htmlFor='rift'>Wild Rift</label>
          </div>
          
        </Modal>
      </section>
    </Layout>
    </>
  )
}