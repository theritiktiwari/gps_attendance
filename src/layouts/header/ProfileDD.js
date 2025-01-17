import React from "react";
import FeatherIcon from "feather-icons-react";
import Link from "next/link";
import { Box, Menu, Typography, ListItemButton, List, ListItemText, Button } from "@mui/material";

const ProfileDD = ({ auth, logout }) => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };
  return (
    <>
      <Button
        aria-label="menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        onClick={handleClick4}
      >
        <Box display="flex" alignItems="center">
          <svg width="30" height="30" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 25C0 11.1929 11.1929 0 25 0H45C47.7614 0 50 2.23858 50 5V25C50 38.8071 38.8071 50 25 50H5C2.23858 50 0 47.7614 0 45V25Z" fill="#0060ff" />
            <path d="M34.9214 36.9165C33.6214 37.5665 32.2381 37.8915 30.7714 37.8915C29.4714 37.8915 28.2881 37.6915 27.2214 37.2915C24.9214 36.4415 22.9631 34.7832 21.3464 32.3165C20.9297 31.7165 20.1547 30.5665 19.0214 28.8665C17.8881 27.1665 17.1547 26.0832 16.8214 25.6165C16.2381 24.6998 15.7714 24.1998 15.4214 24.1165V23.8665C15.4381 23.8665 15.4547 23.8665 15.4714 23.8665C15.5047 23.8665 15.5381 23.8665 15.5714 23.8665C15.6047 23.8665 15.6381 23.8665 15.6714 23.8665C15.7047 23.8665 15.7464 23.8665 15.7964 23.8665C15.8464 23.8665 15.8881 23.8665 15.9214 23.8665C16.7714 23.8665 17.5547 23.6748 18.2714 23.2915C19.3547 22.6915 19.8964 21.5832 19.8964 19.9665C19.8964 18.7832 19.5631 17.8748 18.8964 17.2415C18.2297 16.5915 17.4297 16.2665 16.4964 16.2665H14.5964V30.8415C14.5964 31.2748 14.7547 31.6498 15.0714 31.9665C15.3881 32.2665 15.7631 32.4165 16.1964 32.4165H16.5214V32.6665H8.92139V32.4165H9.24639C9.66305 32.4165 10.0297 32.2665 10.3464 31.9665C10.6631 31.6665 10.8297 31.2998 10.8464 30.8665V16.9915C10.8297 16.5582 10.6631 16.1915 10.3464 15.8915C10.0464 15.5748 9.67972 15.4165 9.24639 15.4165H8.92139V15.1665H17.4964C19.6464 15.1665 21.3131 15.6582 22.4964 16.6415C23.4297 17.4082 23.8964 18.4915 23.8964 19.8915C23.8964 21.2915 23.4381 22.4332 22.5214 23.3165C21.6214 24.1832 20.5881 24.6165 19.4214 24.6165C19.3214 24.6165 19.2131 24.6082 19.0964 24.5915C19.7797 24.9582 20.3464 25.3665 20.7964 25.8165C21.2631 26.2665 21.6631 26.6915 21.9964 27.0915C22.3464 27.4915 22.6381 27.8498 22.8714 28.1665C23.1214 28.4665 23.4464 28.8748 23.8464 29.3915C24.2464 29.8915 24.6631 30.4165 25.0964 30.9665C25.5297 31.5165 26.0047 32.0832 26.5214 32.6665C27.0547 33.2332 27.6381 33.7748 28.2714 34.2915C28.9214 34.8082 29.5797 35.2332 30.2464 35.5665C31.6631 36.2832 33.2214 36.6498 34.9214 36.6665V36.9165ZM36.1122 16.1915V30.8665C36.1289 31.2998 36.2872 31.6665 36.5872 31.9665C36.9039 32.2665 37.2789 32.4165 37.7122 32.4165H38.0122L38.0372 32.6665H30.4372V32.4165H30.7622C31.1789 32.4165 31.5372 32.2665 31.8372 31.9665C32.1539 31.6665 32.3289 31.3082 32.3622 30.8915V16.1915H28.9872C28.2205 16.2082 27.6122 16.4498 27.1622 16.9165C26.7122 17.3832 26.4872 17.9915 26.4872 18.7415V19.0415H26.2372V14.6915C26.4705 14.7915 26.8872 14.8915 27.4872 14.9915C28.1039 15.0915 28.6705 15.1415 29.1872 15.1415H39.2622C40.0789 15.1248 40.7455 15.0582 41.2622 14.9415C41.7789 14.8248 42.0955 14.7415 42.2122 14.6915V19.0415H41.9622V18.7415C41.9622 17.9915 41.7372 17.3832 41.2872 16.9165C40.8372 16.4498 40.2289 16.2082 39.4622 16.1915H36.1122Z" fill="#FFFFFF" />
          </svg>

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
            }}
          >
            <Typography
              color="textSecondary"
              variant="h5"
              fontWeight="400"
              sx={{ ml: 1 }}
            >
              Hello,
            </Typography>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{
                ml: 1,
              }}
            >
              {(auth && auth.user) && auth.user.name || "Admin"}
            </Typography>
            <FeatherIcon icon="chevron-down" width="20" height="20" />
          </Box>
        </Box>
      </Button >
      <Menu
        id="profile-menu"
        anchorEl={anchorEl4}
        keepMounted
        open={Boolean(anchorEl4)}
        onClose={handleClose4}
        sx={{
          "& .MuiMenu-paper": {
            width: "250px",
          },
        }}
      >
        <Box>
          <Box px={2}>
            <List
              component="nav"
              aria-label="secondary mailbox folder"
              onClick={handleClose4}
            >
              <ListItemButton>
                <Button onClick={logout} variant="contained" color='error' sx={{width: '100%'}}>Logout</Button>
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileDD;
