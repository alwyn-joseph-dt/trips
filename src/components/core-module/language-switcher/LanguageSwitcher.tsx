import React, { useEffect } from 'react';
import i18n from 'i18next';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { theme } from '../../../theme';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';

interface Setting {
    label: string;
    value: string;
}

const settings: Setting[] = [
    {
        label: "English",
        value: "en",
    },
    {
        label: "हिन्दी",
        value: "hn",
    },
    {
        label:"عربي",
        value:"ar",
    }
];

const LanguageSwitcher: React.FC = () => {

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );
    const [selectedCountry, setSelectedCountry] = React.useState<Setting|null>(
        null
    );
    const {pathname}=useLocation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleSelectCountry = (setting: Setting) => {
         setSelectedCountry(setting); // Update selected country
        handleCloseUserMenu(); // Close the settings menu after selection
        changeLanguage(setting.value); // Change the language in i18n
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    useEffect(() => {
        const storedLanguage = settings.find((setting) => setting?.value === i18n?.language);
        if (storedLanguage) {
            setSelectedCountry(storedLanguage);
            changeLanguage(storedLanguage.value);
        }
    }, []);

    return (
        <Box
            sx={{ display: "flex", alignItems: "center", float:'right' }}
        >
            <Tooltip title={t("select_language")}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Typography color="black" >{selectedCountry?.label}</Typography>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                disableScrollLock
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings
                    .filter((setting) => setting != selectedCountry)
                    .map((setting) => (
                        <MenuItem
                            key={setting.label}
                            onClick={() => {
                                handleSelectCountry(setting);
                                handleCloseUserMenu();
                            }}
                        >
                          
                            <Typography sx={{ textAlign: "center" }}>
                                {setting.label}
                            </Typography>
                        </MenuItem>
                    ))}
            </Menu>
        </Box>
    );
};

export default LanguageSwitcher;