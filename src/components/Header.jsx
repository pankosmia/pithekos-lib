import React, {useContext, useState} from "react";
import MessagesContext from "../contexts/messagesContext";
import NetContext from "../contexts/netContext";
import DebugContext from "../contexts/debugContext";
import I18nContext from "../contexts/i18nContext";
import {AppBar, Grid2, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {doI18n} from "../lib/i18nLib";
import {Public, PublicOff} from "@mui/icons-material";
import {getJson} from "../lib/getLib";
import SettingsIcon from "@mui/icons-material/Settings";

function Header({subtitle, widget}) {
    const {messages, setMessages} = useContext(MessagesContext);
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    return <div sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Grid2 container direction="row"
                       justifyContent="flex-end"
                       alignItems="center"
                       sx={{flexGrow: 1}}>
                    <Grid2 container size={{xs: 1}} justifyContent="flex-start">
                        <MenuIcon
                            onClick={e => setAnchorEl(e.currentTarget)}
                        />
                        <Menu
                            id="add-project-menu"
                            aria-labelledby="add-project-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={()=>setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem onClick={()=>{window.location.href = "/"}}>{doI18n("components:header:goto_local_projects_menu_item", i18n)}</MenuItem>
                        </Menu>
                    </Grid2>
                    <Grid2 container size={{xs: 5, md: 4, lg: 3}} justifyContent="flex-start">
                        {subtitle && subtitle.length > 0 && <Typography variant="h6">{doI18n(subtitle, i18n)}</Typography>}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 4, lg: 6}} justifyContent="flex-start">
                        {widget}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 2}} justifyContent="flex-end">
                        {
                            enabledRef.current ?
                                <Public
                                    onClick={
                                        async () => {
                                            const response = await getJson(`/net/disable`, debugRef.current);
                                            if (!response.ok) {
                                                setMessages([...messages, `warning--5--${response.url}--${response.status}`])
                                            }
                                        }
                                    }
                                    sx={{color: "#33FF33"}}
                                /> :
                                <PublicOff
                                    onClick={
                                        async () => {
                                            const response = await getJson(`/net/enable`, debugRef.current);
                                            if (!response.ok) {
                                                setMessages([...messages, `warning--5--${response.url}--${response.status}`])
                                            }
                                        }
                                    }
                                    sx={{color: "#AAAAAA"}}
                                />}
                        <SettingsIcon
                            color="inherit"
                            aria-label="settings"
                            sx={{ml: 2}}
                            //onClick={() => navigate("/settings")}
                        />
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    </div>
}

export default Header;