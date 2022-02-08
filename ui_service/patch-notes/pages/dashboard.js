import Layout from '../components/layout'
import Modal from '../components/modal'
import GameCard from '../components/game-card'
import utilStyles from '../styles/utils.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
import { withIronSessionSsr } from 'iron-session/next'

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user
  
    return {
      props: {
        user: user ? user : 'not found',
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

const fetcher = game => fetch(`http://127.0.0.1:5000/note/get-latest-date?game=${game}`).then(r => r.json())
const countFetcher = game => fetch(`http://127.0.0.1:5000/note/get-latest-date?game=${game}`).then(r => r.json())

const getLatestNoteInfo = (game) => {
  const { data, error } = useSWR(game, fetcher)
  return { data: data, error: error }
}

const getCount = (game) => {
  const { data, error } = useSWR(game, countFetcher)
  return { data: data, error: error }
}

export default function Home(user) {
  const [controlModal, setControlModal] = useState(false)

  const router = useRouter()
  if (user.user === 'not found'){
    router.push("/login")
  }
  console.log(user)
  const [componentMounted, setComponentMounted] = useState(false);
  useEffect(() => {
    setComponentMounted(true)
    ReactTooltip.rebuild()
  }, [])

  let count = 3
  // get list of games added by user
  // FOR EACH LOOP - 
  // get data
  // add to a list of games
  // increment count
  // have a "create game card" function? Creates an object with the name, data from api, etc.?
  // GameCard components should be a MAP - i.e., map each entry in list to gamecard component
  // const countData = getCount('valorant')
  // const cardInfo = getLatestNoteInfo('valorant')

  // if (!countData.data || !cardInfo.data) {
  //   return <div>loading...</div>
  // }

  return (
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
        {count === 0 ? (
          <div className={utilStyles.emptyState}>Add your first game to start tracking updates!</div>
        ) : (
            <div className={utilStyles.row}>
            {/* <GameCard logo="/images/VALORANT_Logo_V.jpg" splash={cardInfo.data.banner} title="valorant" totalUpdates={countData.data.count} date={cardInfo.data.date.slice(0, 10)}/> */}
            <GameCard user={user.user} splash="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt180e13a6a1219040/61f4c42f5b8f60514d374fd1/Kayo_Astra_1920x1080.jpg" title="valorant" totalUpdates="12" date="12/22/21"/>
            <GameCard user={user.user} title="league" splash="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt76aa5627378fc122/61f20c6e5425f4730f02fdf0/020122_LOLPatch1203Notes_Banner.jpg" totalUpdates="12" date="12/22/21"/>
            <GameCard user={user.user} title="tft" splash="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltb9e768f749944152/61f09153284f0d35bcbb411b/020122_Patch1203Notes_Banner_v1.jpg" totalUpdates="12" date="12/22/21"/>
            <GameCard user={user.user} title="rift" splash="https://images.contentstack.io/v3/assets/blt370612131b6e0756/blt3b5bf0bc3256b8c7/61df4da814ef402247ceb708/WR_patch-notes_Article_Banner_SETT3.0.jpg" totalUpdates="12" date="12/22/21"/>
            </div>
        )}
        <Modal
          open={controlModal} 
          onChange={() => setControlModal(false)}
        >
          <div>Modal Content Goes Here</div>
          
        </Modal>
      </section>
    </Layout>
  )
}
