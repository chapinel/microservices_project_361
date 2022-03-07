import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import styles from '../../styles/game.module.css'
import Layout from '../../components/layout'
import { withIronSessionSsr } from 'iron-session/next'
import { useState } from 'react'
import PatchCard from '../../components/patch-card'
import Modal from '../../components/modal'
import Games from '../../lib/game_data'
import { getUserData } from '../../lib/user'
import { getGameNameUrl, getUserGameNotifications, getGameNotes } from '../../lib/get_game_info'
import { addUpdateUserGameNotifications } from '../../lib/user_game'
import Notifications from '../../components/notifModal'

// code to set up user session is modeled from the examples provided by NextJs: https://github.com/vvo/iron-session#usage-nextjs
// and https://github.com/vercel/next.js/tree/canary/examples/with-passport

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req, query }) {
      const user = req.session.user

      if (!user) {
        return {
          redirect : {
            destination: '/login',
            permanent: false,
          }
        }
      }

      const game = query.game

      const userData = await getUserData(user.username)
      const gameNotifications = await getUserGameNotifications(user.username, game)
      const gameUrl = await getGameNameUrl(game, "name")
      const notes = await getGameNotes(game)
        
      return {
        props: {
          user: user,
          userData: userData,
          notif: gameNotifications,
          game: game,
          url: gameUrl.url,
          notes: notes
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

export default function Game ({user, userData, notif, game, url, notes}) {
    const [searchValue, setSearchValue] = useState("")
    const [controlNotifModal, setControlNotifModal] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalLoading, setModalLoading] = useState(false)
    const [selectText, setSelectText] = useState("sort by: date (newest to oldest)")
    const [openDropdown, setOpenDropdown] = useState(false)
    const [compareFunction, setCompareFunction] = useState(() => function(a, b){
      if (a.date < b.date) return 1;
      if (a.date > b.date) return -1;
      return 0;
    })

    const router = useRouter()

    const finalList = notes.filter(note => !(note.description.includes("This article will not be visible")))

    const games = Games()

    const refreshPageData = () => {
        router.replace(router.asPath);
    }

    const waitForSuccessMessage = (modalFunction) => {
      setTimeout(() => {
        modalFunction(false)
        setModalSuccess(false)
        refreshPageData()
      }, 1000)
    }

    async function addUserGameNotifications(parameters) {
      setModalLoading(true)
      const response = await addUpdateUserGameNotifications(parameters)
      if (response === true){
        setModalLoading(false)
        setModalSuccess(true)
        waitForSuccessMessage(setControlNotifModal)
      }
    }
    
    const handleSearchOnChange = (e) => {
        setSearchValue(e.target.value)
        console.log(e.target.value)
    }

    const handleNoteClick = (url) => {
        console.log(url)
        var win = window.open(url, '_blank');
        win.focus();
    }

    const handleNotifConfirm = () => {
      const parameters = {
        gameToNotify: game,
        user: user.username,
        email: userData.email,
        service_id: userData.service_id,
        mailChange: notif
      }
      addUserGameNotifications(parameters)
    }

    const sortNotes = (sortObject, sortDirection) => {
      if (sortDirection === 'desc'){
        
       setCompareFunction(() => function(a, b){
          if (a[sortObject] < b[sortObject]) return 1;
          if (a[sortObject] > b[sortObject]) return -1;
          return 0;
        })
      } else {
        setCompareFunction(() => function(a, b){
          if (a[sortObject] > b[sortObject]) return 1;
          if (a[sortObject] < b[sortObject]) return -1;
          return 0;
        })
      }
    }

    const handleSelect = (e) => {
      const text = {
        "title asc": "title (z-a)",
        "title desc": "title (a-z)",
        "date asc": "date (oldest to newest)",
        "date desc": "date (newest to oldest)"
      }
      setSelectText("sort by: " + text[e.target.value])
      setOpenDropdown(false)
      const parameters = e.target.value.split(" ")
      sortNotes(parameters[0], parameters[1])
    }

    return (
        <Layout loggedIn={true}>
        <section>
            <div className={utilStyle.headerWButton}>
                <h1 className={utilStyle.headingXl}>{games[game].name}</h1>
                <div className={styles.headerButton}>
                      <button className={utilStyle.svgButton} data-tip="Tooltip for notifications" onClick={() => setControlNotifModal(true)}>
                        {notif == 'on' ? (<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F54670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        ):( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F54670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell-off"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        )}
                      </button>
                </div>
            </div>
            <div className={styles.hrule}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="15" viewBox="0 0 3764 15" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M1410 15.0001L288 15V10H0V8H288V0L1410 9.80884e-05V8H1455V0L1600 1.26763e-05V8H1646V0L1791 1.26763e-05V8H2917V0L3604 6.00594e-05V8H3764V10H3604V15.0001L2917 15V10H1791V15L1646 15V10H1600V15L1455 15V10H1410V15.0001Z" fill="#37DDC9"/>
              </svg>
            </div>
            <div className={styles.listControls}>
              <div className={styles.search}><input onChange={handleSearchOnChange} type="text" placeholder="Search for a specific title"></input></div>
                <div className={utilStyle.selectContainer}>
                <button className={utilStyle.buttonSelect} onClick={() => setOpenDropdown(!openDropdown)}>
                  {selectText}
                  {openDropdown ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up"><polyline points="18 15 12 9 6 15"/></svg>) :(
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"/></svg>)}
                </button>
                {openDropdown && (
                  <div className={utilStyle.selectDropdown}>
                  <label className={utilStyle.selectLabel} htmlFor="date-desc"><p>date (newest to oldest)</p></label>
                  <input className={utilStyle.selectRadio} onClick={handleSelect} name="sort" type="radio" id="date-desc" value="date desc"></input>
                  <label className={utilStyle.selectLabel} htmlFor="date-asc"><p>date (oldest to newest)</p></label>
                  <input className={utilStyle.selectRadio} onClick={handleSelect} name="sort" type="radio" id="date-asc" value="date asc"></input>
                  <label className={utilStyle.selectLabel} htmlFor="title-desc"><p>title (a-z)</p></label>
                  <input className={utilStyle.selectRadio} onClick={handleSelect} name="sort" type="radio" id="title-desc" value="title desc"></input>
                  <label className={utilStyle.selectLabel} htmlFor="title-asc"><p>title (z-a)</p></label>
                  <input className={utilStyle.selectRadio} onClick={handleSelect} name="sort" type="radio" id="title-asc" value="title asc"></input>
                  </div>
                )}
                </div>
              {/* <select onChange={handleSelect}>
                <option value="date desc">date (newest to oldest)</option>
                <option value="date asc">date (oldest to newest)</option>
                <option value="title asc">name (a-z)</option>
                <option value="title desc">name (z-a)</option>
              </select> */}
            </div>
            {(!finalList) ? (<div>Loading...</div>)
            : (
              <div className={utilStyle.rowAcross}>
                {finalList.filter((note) => note.title.toLowerCase().includes(searchValue.toLowerCase())).sort(compareFunction).map((note) => 
                    <PatchCard key={note.title} 
                    patchCardData={
                      {
                        title: note.title,
                        date: note.date,
                        description: note.description,
                        banner: note.banner,
                        parentUrl: url,
                        url: note.url
                      }
                    }
                    onClick={handleNoteClick}>
                    </PatchCard>
                )}
              </div>
            )}
            <Modal
              modalData={{
                title: `Turn ${notif} notifications`,
                open: controlNotifModal,
                onCancel: () => setControlNotifModal(false),
                onConfirm: handleNotifConfirm,
                success: modalSuccess,
                loading: modalLoading
              }}
              buttonText={{
                confirmText: `Turn ${notif}`
              }}
            >
              <Notifications offOrOn={notif} email={userData.email}/>
            </Modal>
            
        </section>
        </Layout>
    )
}