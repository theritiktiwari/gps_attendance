import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const Footer = ({ siteName }) => {
  const copyright = (year) => {
    const currentYear = new Date().getFullYear();
    return (year === currentYear) ? year : `${year}-${currentYear % 100}`;
  }

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography>
        Copyright &copy; {copyright(2023)}. All rights reserved by{" "}
        <Link href="/" legacyBehavior>
          <a><b>{siteName}</b></a>
        </Link>.
      </Typography>
      <Typography color={"primary"}>
        Designed &amp; Developed by{" "}
        <a href="https://theritiktiwari.vercel.app" target="_blank" rel="noreferrer" style={{ fontWeight: "600" }}>Ritik Tiwari</a>
      </Typography>
    </Box>
  );
};

export default Footer;
