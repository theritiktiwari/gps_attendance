import React from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { Grid } from "@mui/material";
import Main from '../src/Main';
import Profile from '../Components/Profile';

export default function Home({ siteName, auth, logout }) {
  return (
    <>
      {!auth.user && <div className="bg-black h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="sm:text-7xl text-5xl font-bold leading-tight text-white text-center sm:leading-tight lg:leading-tight">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">Attendance</span>
            </span>{" "}
            System
          </p>
          <p className="text-gray-400 text-center mt-4 text-md md:text-xl max-w-2xl font-medium">
            Let&apos;s Make Attendance System smart and convenient with the help of a Location based Attendance Management System
          </p>
          <Link href="/auth/login">
            <div className="flex cursor-pointer items-center space-x-2 h-12 px-8 text-lg text-white bg-blue-600 rounded-lg font-semibold mt-4 hover:bg-blue-700 transition-all duration-200">
              Login
            </div>
          </Link>
        </div>
      </div>}

      {auth.user && <>
        <Head>
          <title>{`Dashboard | ${siteName}`}</title>
        </Head>

        <Main siteName={siteName} auth={auth} logout={logout}>
          <Grid container spacing={0}>
            <Profile auth={auth} />
          </Grid>
        </Main>
      </>}
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  const cookie = cookies && cookies.split(';').map(cookie => cookie.split('=')).reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});
  const token = cookie && cookie['user'];

  let auth = { user: null, token: null };

  if (token) {
    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },
    });
    const res = await req.json();

    if (!res.data) {
      context.res.setHeader('Set-Cookie', `user=; path=/;`);
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        }
      }
    }

    auth = { user: res.data, token: token };
  }

  return {
    props: { auth }
  }
}