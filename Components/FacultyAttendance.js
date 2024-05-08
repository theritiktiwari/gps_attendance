import React, { useState } from 'react'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Input } from '@mui/material'
import BaseCard from "../src/components/BaseCard";

const FacultyAttendance = ({ date, res_data, c_id }) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
    const day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

    const [selectDate, setSelectDate] = useState(`${year}-${day}-${month}`);

    const handleDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
        const day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

        setSelectDate(`${year}-${month}-${day}`);
    }

    const getDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
        const day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();

        return `${year}-${month}-${day}`;
    }

    const main_data = res_data.filter(data => data.course_id === c_id);
    const data = main_data.filter(data => getDate(data.date) === selectDate);

    return (
        <>
            <BaseCard title={`Attendance`}>
                <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                    <Input
                        sx={{
                            width: "100%",
                            marginBottom: "50px",
                        }}
                        type="date"
                        value={selectDate}
                        onChange={(e) => handleDate(e.target.value)}
                    />
                </Typography>
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
                                        Student Name
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                        Status
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography color="textSecondary" variant="h6" fontWeight={"bold"}>
                                        Remarks
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
                                            {item.student_name}
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
                                    <TableCell align='center'>
                                        <Typography color="textSecondary" variant="h6">
                                            {item.remarks || "-"}
                                        </Typography>
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

export default FacultyAttendance;