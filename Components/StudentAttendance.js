import React from 'react';
const { useEffect, useState } = React;
import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material'
import BaseCard from "../src/components/BaseCard";

const StudentAttendance = ({ date, res_data, auth, c_id, tst, router }) => {
    const data = res_data.filter(data => data.course_id === c_id && data.student_id === auth.user._id);

    data.sort((a, b) => {
        if (a.date > b.date) return -1;
        if (a.date < b.date) return 1;
        return 0;
    });

    const [loading, setLoading] = useState(false);
    const [exist, setExist] = useState(false);
    const [location, setLocation] = useState({ latitude: null, longitude: null });

    const getDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
        const day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

        return `${day}-${month}-${year}`;
    }
    useEffect(() => {
        if (data && data.length > 0) {
            data.find(item => getDate(item.date) === date) ? setExist(false) : setExist(true);
        } else {
            setExist(true);
        }
    }, [router]);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        } else {
            return tst("Location is not supported by this browser.", "error");
        }
    }

    const handleSubmit = async (e) => {
        getLocation();
        if (!location.latitude || !location.longitude)
            return tst("Please allow location access", "error");

        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/attendance`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": auth.token
            },
            body: JSON.stringify({
                course_id: c_id,
                student_id: auth.user.id,
                date: date,
                location: location
            })
        });
        const res = await req.json();
        setLoading(false);

        tst(res.message, res.type);
        router.push(router.asPath);
    }

    return (
        <>
            {exist && <BaseCard>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    mb: 2
                }}>
                    <Typography color="textSecondary" variant="p" fontWeight={"bold"}>
                        Mark your attendance for {date}
                    </Typography>
                    <Button variant="contained" mt={2} onClick={handleSubmit}>{loading && "Processing..." || "Submit"}</Button>
                </Box>
            </BaseCard>}

            <BaseCard title={`Attendance`}>
                {data && data.length > 0 ? <>
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
                                        Date
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                        Status
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell align='center'>
                                        <Typography color="textSecondary" variant="h6">
                                            {index + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Typography color="textSecondary" variant="h6">
                                            {getDate(item.date)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Chip
                                            sx={{
                                                pl: "4px",
                                                pr: "4px",
                                                backgroundColor: item.status === "absent" && "error.dark" || "success.dark",
                                                color: "#FFF",
                                                fontWeight: "600",
                                            }}
                                            size="small"
                                            label={(item.status).charAt(0).toUpperCase() + (item.status).slice(1)}
                                        ></Chip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </> : <Typography align="center" color="textSecondary" variant="h6">Not available.</Typography>}
            </BaseCard>
        </>
    )
}

export default StudentAttendance