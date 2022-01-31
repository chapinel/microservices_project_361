import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import GameCard from '../components/game-card'
import utilStyles from '../styles/utils.module.css'
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
  const countData = getCount('valorant')
  const cardInfo = getLatestNoteInfo('valorant')

  if (!countData.data || !cardInfo.data) {
    return <div>loading...</div>
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Games</p>
        <div className={utilStyles.row}>
          <GameCard logo="/images/VALORANT_Logo_V.jpg" splash={cardInfo.data.banner} title="valorant" totalUpdates={countData.data.count} date={cardInfo.data.date.slice(0, 10)}/>
          <GameCard logo="/images/league.png" title="league" totalUpdates="12" date="12/22/21"/>
          <GameCard logo="/images/tft.png" title="teamfight-tactics" totalUpdates="12" date="12/22/21"/>
          <GameCard logo="/images/wild-rift.png" title="wild-rift" totalUpdates="12" date="12/22/21"/>
          <GameCard empty="true"></GameCard>
        </div>
      </section>
      <section>
        <p>patched isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</p>
      </section>
    </Layout>
  )
}
