import { useRouter } from 'next/router'

export default function Game () {

    const router = useRouter()
    const { game } = router.query

    const games = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "teamfight-tactics": "Teamfight Tactics",
        "wild-rift": "Wild Rift"
    }

    return (
        <div>
            <div>
                <p>back button</p>
            </div>
            <div>
                <h1>{games[game]}</h1>
            </div>
            <div>
                <p>Patch Notes go here</p>
            </div>
            
        </div>
    )
}