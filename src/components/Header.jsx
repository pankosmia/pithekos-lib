import React, {useContext, useEffect, useState} from "react";
import MessagesContext from "../contexts/messagesContext";
import NetContext from "../contexts/netContext";
import DebugContext from "../contexts/debugContext";
import I18nContext from "../contexts/i18nContext";
import AuthContext from "../contexts/authContext";
import {AppBar, Grid2, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {doI18n} from "../lib/i18nLib";
import {Public, PublicOff, Cloud, CloudOff} from "@mui/icons-material";
import {getJson} from "../lib/getLib";
import SettingsIcon from "@mui/icons-material/Settings";

function Header({titleKey, widget, currentId}) {
    const {messages, setMessages} = useContext(MessagesContext);
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const i18n = useContext(I18nContext);
    const {authRef} = useContext(AuthContext);
    const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
    const [authAnchorEl, setAuthAnchorEl] = useState(null);
    const hamburgerOpen = Boolean(hamburgerAnchorEl);
    const authOpen = Boolean(authAnchorEl);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(
        () => {
            const doFetch = async () => {
                const fetched = await getJson("/list-clients", debugRef.current);
                if (fetched.ok) {
                    setMenuItems(
                        fetched.json.filter(
                            i => !i.exclude_from_menu && (debugRef.current || !i.requires.debug)
                        )
                    );
                }
            };
            doFetch().then();
        },
        [debugRef.current]
    )
    return <div sx={{flexGrow: 1}}>
        <AppBar position="static">
            <Toolbar sx={{backgroundColor: "#441650"}}>
                <Grid2 container direction="row"
                       justifyContent="flex-end"
                       alignItems="center"
                       sx={{flexGrow: 1}}>
                    <Grid2 container size={{xs: 1}} justifyContent="flex-start">
                        <MenuIcon
                            onClick={e => setHamburgerAnchorEl(e.currentTarget)}
                        />
                        <Menu
                            id="app-menu"
                            anchorEl={hamburgerAnchorEl}
                            open={hamburgerOpen}
                            onClose={() => setHamburgerAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >{
                            menuItems
                                .map(
                                    (mi, n) => mi.id === currentId ?
                                        <MenuItem key={n}><i>{doI18n(`pages:${mi.id}:title`, i18n)}</i></MenuItem> :
                                        <MenuItem
                                            key={n}
                                            onClick={() => {
                                                window.location.href = mi.url
                                            }}
                                            disabled={mi.requires.net && !enabledRef.current}
                                        >{
                                            doI18n(`pages:${mi.id}:title`, i18n)
                                        }</MenuItem>
                                )
                        }
                        </Menu>
                    </Grid2>
                    <Grid2 container size={{xs: 5, md: 4, lg: 3}} justifyContent="flex-start">
                        {titleKey && titleKey.length > 0 &&
                            <Typography variant="h6">{doI18n(titleKey, i18n)}</Typography>}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 4, lg: 6}} justifyContent="flex-start">
                        {widget}
                    </Grid2>
                    <Grid2 container size={{xs: 3, md: 2}} justifyContent="flex-end">
                        {
                            enabledRef.current ?
                                <>
                                <Cloud onClick={e => setAuthAnchorEl(e.currentTarget)}/>
                                    <Menu
                                        id="auth-menu"
                                        anchorEl={authAnchorEl}
                                        open={authOpen}
                                        onClose={() => setAuthAnchorEl(null)}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >{
                                        Object.entries(authRef.current)
                                            .map(
                                                (mi, n) => <MenuItem
                                                        key={n}
                                                        onClick={() => {
                                                            window.location.href = mi[1].isActive ? `${mi[1].endpoint}/logout` : `/gitea/login/${mi[0]}/`;
                                                        }}
                                                    >{
                                                        `${mi[0]} ${mi[1].isActive ? "✓" : "❌"}`
                                                    }</MenuItem>
                                            )
                                    }
                                    </Menu>
                                </>
                                :
                                <CloudOff disabled={true} sx={{color: "#AAAAAA"}}/>
                        }
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
                                    sx={{color: "#33FF33", ml: 2}}
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
                                    sx={{color: "#AAAAAA", ml: 2}}
                                />}
                        {
                            currentId.includes("settings") ?
                                <SettingsIcon
                                    color="inherit"
                                    aria-label="settings"
                                    sx={{ml: 2, color: "#AAAAAA"}}
                                /> :
                                <SettingsIcon
                                    color="inherit"
                                    aria-label="settings"
                                    sx={{ml: 2}}
                                    onClick={() => {
                                        window.location.href = "/clients/settings"
                                    }}
                                />
                        }
                    </Grid2>
                </Grid2>
            </Toolbar>
        </AppBar>
    </div>
}

export default Header;