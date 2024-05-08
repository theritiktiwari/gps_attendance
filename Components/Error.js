import { Box, Button } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const Error = ({ siteName }) => {
    return (
        <>
            <Head>
                <title>{`Error | ${siteName}`}</title>
            </Head>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}>
                <Link href="/">
                    <Button sx={{ backgroundColor: "#2563EB !important" }} variant="contained" mt={2}>Back Home</Button>
                </Link>
            </Box></>
    )
}

export default Error