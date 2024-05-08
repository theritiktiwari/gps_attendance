import React from 'react';
const { useEffect, useState } = React;
import Head from 'next/head';
import { Grid, Typography, Table, Box, TableBody, TableCell, TableHead, TableRow, Stack, Pagination, Checkbox, Button } from "@mui/material";
import Main from '../../src/Main';
import BaseCard from "../../src/components/BaseCard";

const Index = ({ siteName, res, auth, logout, router, tst }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [middleState, setMiddleState] = useState(false);

    const handleChangePage = (event, page) => {
        setCurrentPage(page);
    };

    res.data.map((user, index) => {
        user.sno = index + 1;
    });

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const currentData = res.data.slice(startIndex, endIndex);

    const getData = () => {
        let data = {};
        currentData.map((enroll) => {
            data[enroll._id] = false;
        });
        return data;
    }

    const [checkedState, setCheckedState] = useState({
        mainCheckbox: false,
        checkboxes: getData()
    });

    useEffect(() => {
        setCheckedState({
            mainCheckbox: false,
            checkboxes: getData()
        });
    }, [currentPage]);

    const getStatus = () => {
        let state = Object.keys(checkedState.checkboxes).some((checkbox) => {
            return checkedState.checkboxes[checkbox] === true;
        });
        return state;
    }

    const handleMainCheckboxChange = (event) => {
        const checked = event.target.checked;
        const updatedCheckboxes = {
            ...checkedState.checkboxes,
        };
        Object.keys(updatedCheckboxes).forEach((checkbox) => {
            updatedCheckboxes[checkbox] = checked;
        });

        if (checked) setMiddleState(false);

        setCheckedState({
            mainCheckbox: checked,
            checkboxes: updatedCheckboxes,
        });
    };

    const handleCheckboxChange = (id) => (event) => {
        const checked = event.target.checked;

        const newCheckboxes = {
            ...checkedState.checkboxes,
            [id]: checked,
        };

        let state = Object.keys(newCheckboxes).some((checkbox) => {
            return newCheckboxes[checkbox];
        });

        let main = Object.keys(newCheckboxes).every((checkbox) => newCheckboxes[checkbox]);

        if (main) setMiddleState(false);
        else if (state) setMiddleState(true);
        else setMiddleState(false);

        setCheckedState({
            mainCheckbox: main,
            checkboxes: newCheckboxes
        });
    }

    const handleSubmit = async (e) => {
        let checkboxes = Object.keys(checkedState.checkboxes).filter(checkbox => checkedState.checkboxes[checkbox]);

        if (checkboxes.length === 0) return tst("Please select atleast one enrollment", "error");

        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/enrollment`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify({
                ids: checkboxes
            })
        });
        const res = await req.json();
        setLoading(false);

        tst(res.message, res.type);
        router.push(router.asPath);
    }

    return (
        <>
            <Head>
                <title>{`Enrollments | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="All Enrollments">
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
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Student Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    <Checkbox
                                                        checked={!middleState && checkedState.mainCheckbox}
                                                        indeterminate={middleState}
                                                        onChange={handleMainCheckboxChange}
                                                    />
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(currentData).map((enroll) => (
                                            <TableRow style={{ cursor: "pointer" }} key={currentData[enroll]._id}>
                                                <TableCell align='center'>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "15px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {currentData[enroll].sno}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[enroll].course_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='left'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[enroll].faculty_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentData[enroll].student_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {currentPage && <Checkbox
                                                            checked={checkedState.checkboxes[currentData[enroll]._id]}
                                                            onChange={handleCheckboxChange(currentData[enroll]._id)}
                                                            id={`check-${enroll._id}`}
                                                        />}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </> : <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography variant="h6">No Enrollemnts Found</Typography>
                                    </TableCell>
                                </TableRow>}
                            </Table>
                            {getStatus() && <>
                                <br />
                                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                    <Button disabled={loading} variant="contained" mt={2} onClick={handleSubmit} color='error'>{loading && "Processing..." || "Delete"}</Button>
                                </Box>
                            </>}

                            <Box mt={3} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        color="primary"
                                        count={Math.ceil(res.data.length / 10)}
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

    if (adminRes.data.role !== 'admin')
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }

    auth = { user: adminRes.data, token: token };


    const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/enrollment`, {
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