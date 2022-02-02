import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import GameCard from '../components/game-card'
import Footer from '../components/footer'
import utilStyles from '../styles/utils.module.css'
import homestyles from '../styles/Home.module.css'
import useSWR from 'swr'

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

export default function Home() {

  // get list of games added by user
  // FOR EACH LOOP - 
  // get data
  // add to a list of games
  // have a "create game card" function? Creates an object with the name, data from api, etc.?
  // GameCard components should be a MAP - i.e., map each entry in list to gamecard component
  // const countData = getCount('valorant')
  // const cardInfo = getLatestNoteInfo('valorant')

  // if (!countData.data || !cardInfo.data) {
  //   return <div>loading...</div>
  // }

  return (
    <Layout home>
      <section>
        <div className={utilStyles.headingXl}>
          <p>YOUR GAMES</p>
        </div>
        <div className={utilStyles.row}>
          {/* <GameCard logo="/images/VALORANT_Logo_V.jpg" splash={cardInfo.data.banner} title="valorant" totalUpdates={countData.data.count} date={cardInfo.data.date.slice(0, 10)}/> */}
          <GameCard splash="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt180e13a6a1219040/61f4c42f5b8f60514d374fd1/Kayo_Astra_1920x1080.jpg" title="valorant" totalUpdates="12" date="12/22/21"/>
          <GameCard title="league" splash="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt76aa5627378fc122/61f20c6e5425f4730f02fdf0/020122_LOLPatch1203Notes_Banner.jpg" totalUpdates="12" date="12/22/21"/>
          <GameCard title="tft" splash="https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/bltb9e768f749944152/61f09153284f0d35bcbb411b/020122_Patch1203Notes_Banner_v1.jpg" totalUpdates="12" date="12/22/21"/>
          <GameCard title="rift" splash="https://images.contentstack.io/v3/assets/blt370612131b6e0756/blt3b5bf0bc3256b8c7/61df4da814ef402247ceb708/WR_patch-notes_Article_Banner_SETT3.0.jpg" totalUpdates="12" date="12/22/21"/>
        </div>
        {/* <Footer></Footer> */}
      </section>
    </Layout>
  )
}
