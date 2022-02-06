import { useRouter } from 'next/router'
import utilStyle from '../../styles/utils.module.css'
import Layout from '../../components/layout'
import { withIronSessionSsr } from 'iron-session/next'
import React, { useEffect, useState } from 'react'

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

export default function Game (user) {

    const router = useRouter()
    if (user.user === 'not found'){
        router.push("/login")
    }
    console.log(user)
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