import React, { useState } from 'react'
import Head from 'next/head';
import Link from 'next/link';
import { AiFillRightSquare } from 'react-icons/ai';
import { Grid, Typography, Table, Box, TableBody, TableCell, TableHead, TableRow, Stack, Pagination } from "@mui/material";
import Main from '../../src/Main';
import BaseCard from "../../src/components/BaseCard";

const Index = ({ siteName, res, auth, logout }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    res.data.map((user, index) => {
        user.sno = index + 1;
    });

    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    const currentData = res.data.slice(startIndex, endIndex);

    return (
        <>
            <Head>
                <title>{`Courses | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="All Courses">
                            <Table
                                aria-label="simple table"
                                sx={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {Object.keys(currentData).length ? <>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    S.No.
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Course Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Faculty Name
                                                </Typography>
                                            </TableCell>
                                            {(auth.user.role === "admin" || auth.user.role === "faculty") && <>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                        Latitute
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                        Longitude
                                                    </Typography>
                                                </TableCell>
                                                {auth.user.role !== "faculty" && <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                        Enrollments
                                                    </Typography>
                                                </TableCell>}
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                        Action
                                                    </Typography>
                                                </TableCell>
                                            </>}
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Attendance
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(currentData).map((course) => (
                                            <TableRow style={{ cursor: "pointer" }} key={currentData[course]._id}>
                                                <TableCell align='center'>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "15px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {currentData[course].sno}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[course].name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[course].faculty_name}
                                                    </Typography>
                                                </TableCell>
                                                {(auth.user.role === "admin" || auth.user.role === "faculty") && <>
                                                    <TableCell align='center'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[course].location.latitude}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography color="textSecondary" variant="h6">
                                                            {currentData[course].location.longitude}
                                                        </Typography>
                                                    </TableCell>
                                                    {auth.user.role !== "faculty" && <TableCell align='center'>
                                                        <Link href={`/enrollments/${currentData[course]._id}`} key={currentData[course]._id}>
                                                            <Typography color="textSecondary" variant="h6" className='flex justify-center items-center'>
                                                                <AiFillRightSquare fontSize={"1.5rem"} color='#2563EB' />
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>}
                                                    <TableCell align='center'>
                                                        <Link href={`/courses/${currentData[course]._id}`} key={currentData[course]._id}>
                                                            <Typography color="textSecondary" variant="h6" className='flex justify-center items-center'>
                                                                <AiFillRightSquare fontSize={"1.5rem"} color='#2563EB' />
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>
                                                </>}

                                                <TableCell align='center'>
                                                    <Link href={`/attendance/${currentData[course]._id}`} key={currentData[course]._id}>
                                                        <Typography color="textSecondary" variant="h6" className='flex justify-center items-center'>
                                                            <AiFillRightSquare fontSize={"1.5rem"} color='#2563EB' />
                                                        </Typography>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </> : <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="h6">No Courses Found</Typography>
                                    </TableCell>
                                </TableRow>}
                            </Table>

                            <Box mt={3} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        color="primary"
                                        count={Math.ceil(res.data.length / 5)}
                                        page={currentPage}
                                        onChange={handleChangePage}
                                    />
                                </Stack>
                            </Box>
                        </BaseCard>
                    </Grid>
                </Grid>
            </Main>
        </>
    );
};

export default Index;

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

    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/course`, {
        method: "GET",
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