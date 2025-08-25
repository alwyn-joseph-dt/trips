import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';
import NavigationBar from '../NavigationBar/NavigationBar';

const NewTrip = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(ROUTES.ADDNEWTRAVELER);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>
                <NavigationBar />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: { xs: "16rem", sm: "7rem" }, gap: 5 }}>
                <Typography sx={{ fontSize: { xs: "16px", sm: "20px" }, fontWeight: "600", color: "#8C8C8C" }}>What would you like to call this trip?</Typography>
                <Divider sx={{ backgroundColor: "#E3E8EF", width: "50%" }} />
                <Button
                    onClick={() => handleClick()}
                    sx={{ height: "40px", width: "10rem", backgroundColor: "#0087FA", color: "#FFFFFF", margin: "10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textTransform: "none" }}>
                    <PersonAddAltOutlinedIcon sx={{ marginRight: "4px" }} />
                    Who's Travelling?
                </Button>
            </Box>
        </Box>
    )
}

export default NewTrip
