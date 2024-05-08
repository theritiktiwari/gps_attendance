import React, { useState } from 'react'
import Head from 'next/head';
import { Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, Checkbox } from "@mui/material";
import Main from '../../src/Main';
import BaseCard from "../../src/components/BaseCard";
import Error from '../../Components/Error';

const ID = ({ siteName, auth, logout, res, tst, router }) => {
    const [loading, setLoading] = useState(false);
    const [middleState, setMiddleState] = useState(false);

    const students = res.students.filter(student => {
        const exist = res.enroll.find(enroll => enroll.student_id === student._id);
        if (exist) return false;
        return true;
    });

    const [checkedState, setCheckedState] = useState({
        mainCheckbox: false,
        checkboxes: students.reduce(
            (options, option) => ({
                ...options,
                [option._id]: false
            }),
            {}
        ),
    });

    if (!res.courses) return <>
        <Error siteName={siteName} />
    </>;

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

    const id = router.query.id;

    const handleSubmit = async (e) => {

        let checkboxes = Object.keys(checkedState.checkboxes).filter(checkbox => checkedState.checkboxes[checkbox]);

        if (checkboxes.length === 0) return tst("Please select atleast one student", "error");

        setLoading(true);

        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/enrollment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify({
                course_id: id,
                students: checkboxes
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
                <title>{`Enroll Students | ${siteName}`}</title>
            </Head>
            <Main siteName={siteName} auth={auth} logout={logout}>
                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title={`New Enrollment for ${res.courses.name}`}>
                            {students.length > 0 ? <>
                                <Table
                                    aria-label="simple table"
                                    sx={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    S.No.
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Name
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                                    Username
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
                                        {students.map((student, index) => (
                                            <TableRow key={student._id}>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {student.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        {student.unique_id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'>
                                                    <Typography color="textSecondary" variant="h6">
                                                        <Checkbox
                                                            checked={checkedState.checkboxes[student._id]}
                                                            onChange={handleCheckboxChange(student._id)}
                                                            id={`check-${student._id}`}
                                                        />
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <br />
                                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                    <Button disabled={loading} variant="contained" mt={2} onClick={handleSubmit}>{loading && "Processing..." || "Submit"}</Button>
                                </Box>
                            </> : <Typography align="center" color="textSecondary" variant="h6">No students available for enrollment.</Typography>}
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

    const studentReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });
    const studentRes = await studentReq.json();
    const student = studentRes.data.filter(student => student.role === "student");

    const CourseReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/course/${context.query.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });

    const CourseRes = await CourseReq.json();

    const EnrollReq = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/enrollment`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        }
    });

    const EnrollRes = await EnrollReq.json();

    const enrollments = EnrollRes.data.filter(enrollment => enrollment.course_id === context.query.id);

    return {
        props: {
            res: {
                courses: CourseRes.data || null,
                students: student,
                enroll: enrollments
            },
            auth
        }
    };
}