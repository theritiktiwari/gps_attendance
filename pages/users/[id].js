import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Stack, TextField, Select, Button, Box } from "@mui/material";
import Main from '../../src/Main';
import BaseCard from "../../src/components/BaseCard";

const ID = ({ siteName, auth, logout, res, tst, router }) => {
    const [form, setForm] = useState(res.data);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    
    const id = router.query.id;

    const handleSubmit = async (e) => {
        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify(form)
        });
        const res = await req.json();
        setLoading(false);

        tst(res.message, res.type);
        router.push(router.asPath);
    }

    const handleDelete = async (e) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            }
        });

        const res = await req.json();
        setLoading(false);

        tst(res.message, res.type);
        router.push("/users");
    }

    return (
        <>
            <Head>
                <title>{`User Details | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="User Details">
                            <Stack spacing={3}>
                                <TextField
                                    name='name'
                                    value={form.name || ""}
                                    onChange={handleChange}
                                    label="Name"
                                    variant="outlined"
                                />
                                <TextField
                                    name='email'
                                    value={form.email || ""}
                                    onChange={handleChange}
                                    label="Email"
                                    variant="outlined"
                                />
                                <TextField
                                    name='unique_id'
                                    value={form.unique_id || ""}
                                    onChange={handleChange}
                                    label="Username"
                                    variant="outlined"
                                />
                                <TextField
                                    name='password'
                                    value={form.password || ""}
                                    onChange={handleChange}
                                    label="Password"
                                    variant="outlined"
                                />
                                <Select
                                    native
                                    name='role'
                                    value={form.role || ""}
                                    onChange={handleChange}
                                    label="Role"
                                >
                                    <option value={"admin"}>Admin</option>
                                    <option value={"faculty"}>Faculty</option>
                                    <option value={"student"}>Student</option>
                                </Select>

                            </Stack>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button disabled={loading} variant="contained" mt={2} onClick={handleSubmit}>{loading && "Processing..." || "Update"}</Button>
                                <Button disabled={loading} variant="contained" mt={2} onClick={(handleDelete)} color='error'>{loading && "Processing..." || "Delete"}</Button>
                            </Box>
                        </BaseCard>
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

    if (adminRes.data.role !== 'admin')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    auth = { user: adminRes.data, token: token };


    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/user/${context.query.id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    const res = await req.json();

    return {
        props: { res, auth }
    };
}