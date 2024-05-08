import React, { useState } from 'react'
import Head from 'next/head';
import { Grid } from "@mui/material";
import Main from '../../src/Main';
// import Error from '../../Components/Error';
import StudentAttendance from '../../Components/StudentAttendance';
import FacultyAttendance from '../../Components/FacultyAttendance';

const ID = ({ siteName, auth, logout, res, tst, router }) => {
    const date = new Date();
    let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    let month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const todayDate = `${day}-${month}-${date.getFullYear()}`;

    const [loading, setLoading] = useState(false);

    // if (!res.courses) return <>
    //     <Error siteName={siteName} />
    // </>;
    return (
        <>
            <Head>
                <title>{`Attendance | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        {auth.user.role === "student" && <StudentAttendance
                            date={todayDate}
                            res_data={res}
                            auth={auth}
                            tst={tst}
                            router={router}
                            c_id={router.query.id}
                        />}
                        {(auth.user.role === "admin" || auth.user.role === "faculty") && <FacultyAttendance
                            date={todayDate}
                            res_data={res}
                            c_id={router.query.id}
                        />}
                    </Grid>
                </Grid>
            </Main>
        </>
    )
}

export default ID;

export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const cookie = cookies && cookies.split(';').map(cookie => cookie.split('=')).reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: decodeURIComponent(value) }), {});
    const token = cookie && cookie['user'];


    if (!token)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }

    let auth = { user: null, token: null };

    const adminReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        },
    });
    const adminRes = await adminReq.json();

    if (!adminRes.data) {
        context.res.setHeader('Set-Cookie', `user=; path=/;`);
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            }
        }
    }

    auth = { user: adminRes.data, token: token };

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/attendance`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    const res = await req.json();

    return {
        props: {
            res: res.data,
            auth
        }
    };
}