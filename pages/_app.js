import React from 'react';
const { useEffect, useState } = React;
import Head from 'next/head';
import { useRouter } from 'next/router';

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';

import '../styles/globals.css';
import Loader from '../Components/Loader';

export default function App({ Component, pageProps }) {
  const siteName = "AMS";
  const description = "Let's Make Attendance System smart and convenient with the help of a Location based Attendance Management System";
  const siteColor = "#2563EB";
  const router = useRouter();

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoader(true))
    router.events.on('routeChangeComplete', () => setLoader(false))
  }, [router]);

  // Logout function
  const logout = () => {
    document.cookie = "user=; path=/;";
    router.push("/");
  }

  // Function for notifications
  // const tst = (msg, type) => {
  //   const data = {
  //     position: "bottom-right",
  //     autoClose: 3000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light"
  //   }
  //   if (type == "success")
  //     toast.success(`${msg}`, data);
  //   else
  //     toast.error(`${msg}`, data);
  // }
  const tst = (msg, type) => {
    if (type == "success")
      toast.success(`${msg}`);
    else
      toast.error(`${msg}`);
  }


  return (
    <>
      <Head>
        <title>{`${siteName} | Home`}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={siteColor} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />

      {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}

      {loader ? <Loader color={siteColor} /> : <>
        <Component {...pageProps} siteName={siteName} tst={tst} router={router} color={siteColor} logout={logout} />
      </>}
    </>
  )
}
