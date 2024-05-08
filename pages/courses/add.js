import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Stack, TextField, Button } from "@mui/material";
import Main from '../../src/Main';
import BaseCard from "../../src/components/BaseCard";

const Add = ({ siteName, auth, logout, tst, router }) => {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setForm({
                    ...form,
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
            });
        } else {
            tst("Please allow location access.", "error");
            return;
        }
    }

    const handleSubmit = async (e) => {
        getLocation();

        if (!form.name)
            return tst("Please fill the name of the course.", "error");

        if (auth.user.role === "admin" && !form.id)
            return tst("Please fill the faculty id.", "error");

        if (!form.location)
            return tst("Please allow location access.", "error");

        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/course`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify(form)
        });

        const res = await req.json();
        setLoading(false);
        tst(res.message, res.type);

        if (res.type === "success") router.push("/courses");
    }

    return (
        <>
            <Head>
                <title>{`Add Course | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Add Course">
                            <Stack spacing={3}>
                                <TextField
                                    name='name'
                                    value={form.name || ""}
                                    onChange={handleChange}
                                    label="Name"
                                    variant="outlined"
                                />
                                {auth.user.role === "admin" && <TextField
                                    name='id'
                                    value={form.id || ""}
                                    onChange={handleChange}
                                    label="Faculty ID"
                                    variant="outlined"
                                />}

                            </Stack>
                            <br />
                            <Button disabled={loading} variant="contained" mt={2} onClick={handleSubmit}>{loading && "Processing..." || "Submit"}</Button>
                        </BaseCard>
                    </Grid>
                </Grid>
            </Main>
        </>
    )
}

export default Add;

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

    if (adminRes.data.role !== 'admin' && adminRes.data.role !== 'faculty')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    auth = { user: adminRes.data, token: token };

    return {
        props: { auth }
    };
}