import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import Layout from '../../components/layout'

export default function Game () {

    const router = useRouter()
    const { game } = router.query

    const games = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "tft": "Teamfight Tactics",
        "rift": "Wild Rift"
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <h1 className={utilStyle.headingXl}>{games[game]}</h1>
        </section>
        </Layout>
    )
}