import React from 'react'
import { Grid, Typography, Table, TableBody, TableCell, TableRow } from "@mui/material";
import BaseCard from "../src/components/BaseCard";

const Profile = ({ auth }) => {
    delete auth.user._id;
    delete auth.user.__v;
    delete auth.user.timestamp;
    
    return (
        <>
            <Grid item xs={12} lg={12}>
                <BaseCard title="Your Details">
                    <Table
                        aria-label="simple table"
                        sx={{
                            whiteSpace: "nowrap",
                        }}
                    >
                        <TableBody>
                            {Object.keys(auth.user).map((key, index) => {
                                return (
                                    <TableRow style={{ cursor: "pointer" }} key={index}>
                                        <TableCell align='left'>
                                            <Typography
                                                sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "800",
                                                }}
                                            >
                                                {key === "unique_id" && "Username" || key.charAt(0).toUpperCase() + key.slice(1)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Typography
                                                sx={{
                                                    fontSize: "15px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {auth.user[key]}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </BaseCard>
            </Grid >
        </>
    );
};

export default Profile;