import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import styles from '../../styles/game.module.css'
import Layout from '../../components/layout'
import { withIronSessionSsr } from 'iron-session/next'
import { useEffect, useState } from 'react'
import PatchCard from '../../components/patch-card'
import Toggle from '../../components/toggle'
import ReactTooltip from 'react-tooltip'
import useSWR from 'swr'

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

const fetcher = game => fetch(`http://127.0.0.1:5000/note/get?game=${game}`).then(r => r.json())

const getAllNotes = (game) => {
    const { data, error } = useSWR(game, fetcher)
    return { data: data, error: error }
  }

export default function Game (user) {
    const [searchValue, setSearchValue] = useState("")
    const [noteUrl, setNoteUrl] = useState("")
    const [componentMounted, setComponentMounted] = useState(false);
    
    useEffect(() => {
        setComponentMounted(true)
        ReactTooltip.rebuild()
    }, [])

    const handleSearchOnChange = (e) => {
        setSearchValue(e.target.value)
        console.log(e.target.value)
    }

    const router = useRouter()
    if (user.user === 'not found'){
        router.push("/login")
    }
    console.log(user)
    const { game } = router.query

    let finalList = null;
    const notes = getAllNotes(game)
    if (notes.data){
        finalList = notes.data.notes.filter(note => !(note[2].includes("This article will not be visible")))
    }

    console.log(finalList)
    console.log(noteUrl)

    const games = {
        "valorant": "Valorant",
        "league": "League of Legends",
        "tft": "Teamfight Tactics",
        "rift": "Wild Rift"
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={styles.header}>
                <h1 className={utilStyle.headingXl}>{games[game]}</h1>
                <Toggle />
                <p className={styles.notifications} data-tip="Tooltip for notifications">Turn on notifications</p>
                {componentMounted && <ReactTooltip effect="solid" place="bottom" multiline={true}/>}
            </div>
            <div className={styles.search}><input onChange={handleSearchOnChange} placeholder="Search for a specific title"></input></div>
            {(!finalList) ? (<div>Loading...</div>)
            : (
                finalList.filter((note) => note[1].toLowerCase().includes(searchValue.toLowerCase())).map((note) =>
                <div onClick={() => setNoteUrl(note[3])}>
                    <PatchCard title={note[1]} date={note[6]} description={note[2]} banner={note[5]}></PatchCard>
                </div> )
            )} 
        </section>
        </Layout>
    )
}