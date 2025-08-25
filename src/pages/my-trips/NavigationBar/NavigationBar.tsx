
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import musafirbiz from '../../../assets/images/musafirbiz-logo.svg';
import profile from '../../../assets/images/profile.png';
const CustomTypography = ({ children }: { children: React.ReactNode }) => <Typography sx={{ color: "#000", fontSize: "12px", fontWeight: "400", fontStyle: "poppins" }}>{children}</Typography>;
const NavigationBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <Grid>
            <AppBar sx={{ backgroundColor: "#fff", boxShadow: "none", height: "50px" }}>
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                    <Box
                        component="img"
                        src={musafirbiz}
                        alt="Musafir Biz Logo"
                        sx={{
                            height: '90px',
                            width: "90px",
                            objectFit: "contain"
                        }}
                    />
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: "row", gap: "1.5rem", alignItems: "center" }}>
                        <CustomTypography>Home</CustomTypography>
                        <CustomTypography>My Trips</CustomTypography>
                        <CustomTypography>Events</CustomTypography>
                        <CustomTypography>People</CustomTypography>
                        <CustomTypography>Account Settings</CustomTypography>
                        <CustomTypography>Help</CustomTypography>
                        <Box sx={{ height: "auto", backgroundColor: "#F5F5F6", display: "flex", flexDirection: "row", alignItems: "center", borderRadius: "30px" }}>
                            <IconButton>
                                <LanguageIcon />
                            </IconButton>
                            <Typography sx={{ color: "#000" }}>|</Typography>
                            <IconButton>
                                <MonetizationOnOutlinedIcon />
                            </IconButton>
                            <IconButton sx={{ padding: "0px 8px 0px 0px" }}>
                                <KeyboardArrowDownOutlinedIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ backgroundColor: "#F5F5F6", borderRadius: "100%" }}>
                            <IconButton>
                                <NotificationsNoneIcon />
                            </IconButton>
                        </Box>
                        <Box
                            component="img"
                            src={profile}
                            sx={{
                                height: "30px",
                                width: "30px",
                                objectFit: "contain"
                            }}
                        />
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <MenuOutlinedIcon sx={{ color: "#000" }} />
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>
            {isMenuOpen && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "64px",
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        padding: "1rem",
                        display: { xs: 'block', sm: 'none' },
                        boxShadow: 3,
                        zIndex: 9999
                    }}
                >
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>Home</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>My Trips</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>Events</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>People</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>Account Settings</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>Help</Typography>
                    <Typography sx={{ color: "#000", fontSize: "16px", fontWeight: "400" }}>Profile</Typography>
                </Box>
            )}
        </Grid>
    )
}

export default NavigationBar
