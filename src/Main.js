import React from 'react'
import theme from "./theme/theme";
import FullLayout from "./layouts/FullLayout";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from '@emotion/react';
import createEmotionCache from "./createEmotionCache";

export default function Main({ siteName, auth, logout, children }) {
    const clientSideEmotionCache = createEmotionCache();
    const emotionCache = clientSideEmotionCache;

    return (
        <>
            <CacheProvider value={emotionCache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <FullLayout siteName={siteName} auth={auth} logout={logout}>
                        {children}
                    </FullLayout>
                </ThemeProvider>
            </CacheProvider>
        </>
    )
}