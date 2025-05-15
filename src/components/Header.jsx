import React, {useContext, useEffect, useState} from "react";
import NetContext from "../contexts/netContext";
import DebugContext from "../contexts/debugContext";
import I18nContext from "../contexts/i18nContext";
import AuthContext from "../contexts/authContext";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Menu,
    MenuItem, Switch,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {doI18n} from "../lib/i18nLib";
import {Cloud, CloudOff, UnfoldMore} from "@mui/icons-material";
import {getJson} from "../lib/getLib";
import {postEmptyJson} from "../lib/postLib";
import SettingsIcon from "@mui/icons-material/Settings";
import InternetSwitch from "./InternetSwitch";

function Header({titleKey, widget, currentId}) {
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const {i18nRef} = useContext(I18nContext);
    const {authRef} = useContext(AuthContext);
    const [authAnchorEl, setAuthAnchorEl] = useState(null);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const authOpen = Boolean(authAnchorEl);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(
        () => {
            const appI18n = doI18n("branding:software:name", i18nRef.current);
            const pageI18n = doI18n(titleKey, i18nRef.current);
            document.title = `${pageI18n} - ${appI18n}`;
        }
    );

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
    const currentUrl = menuItems.filter(i => i.id === currentId).length === 1 ? menuItems.filter(i => i.id === currentId)[0].url : "";
    return <Box display="flex-start" sx={{flexGrow: 1, m: 0, p: 0}}>
        <AppBar position="static" sx={{m: 0, p: 0}}>
            <Toolbar variant="dense" sx={{m: 0, p: 0}}>
                <Box sx={{m: 0, mr: 2}}>
                    <IconButton onClick={e => setDrawerIsOpen(true)}>
                        <MenuIcon sx={{color: "#FFF"}}/>
                    </IconButton>
                    <Drawer
                        open={drawerIsOpen} onClose={() => setDrawerIsOpen(false)}
                    >
                        <Box sx={{width: 250, m: 0, p: 0}} role="presentation">
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <UnfoldMore/>
                                    </ListItemIcon>
                                    <Switch
                                        edge="end"
                                        onChange={
                                            ev => {
                                                getJson(`/debug/${debugRef.current ? "disable" : "enable"}`)
                                                    .then(
                                                        () => {
                                                            ev.stopPropagation();
                                                            ev.preventDefault();
                                                        }
                                                    );
                                            }
                                        }
                                        checked={debugRef.current}
                                    />
                                </ListItem>
                                {
                                    menuItems
                                        .map(
                                            (mi, n) => mi.id === currentId ?
                                                <ListItem key={n} disablePadding onClick={() => setDrawerIsOpen(false)}>
                                                    <ListItemButton selected={true}>
                                                        <ListItemText
                                                            primary={doI18n(`pages:${mi.id}:title`, i18nRef.current)}/>
                                                    </ListItemButton>
                                                </ListItem> :
                                                <ListItem key={n} disablePadding>
                                                    <ListItemButton
                                                        disabled={mi.requires.net && !enabledRef.current}
                                                        onClick={() => {
                                                            window.location.href = mi.url
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={doI18n(`pages:${mi.id}:title`, i18nRef.current)}/>
                                                    </ListItemButton>
                                                </ListItem>
                                        )
                                }
                            </List>
                        </Box>
                    </Drawer>
                </Box>
                {titleKey && titleKey.length > 0 &&
                    <Typography variant="h6" sx={{m: 0, p: 0}}>{doI18n(titleKey, i18nRef.current)}</Typography>}
                <Box sx={{flexGrow: 1, m: 0, p: 0}}>
                    {widget}
                </Box>
                <Box sx={{m: 0, p: 0}}>
                    <IconButton sx={{m: 0, p: 0}} onClick={e => setAuthAnchorEl(e.currentTarget)}
                                disabled={!enabledRef.current}>
                        {enabledRef.current ? <Cloud sx={{color: "#FFF", mr: 2}}/> :
                            <CloudOff sx={{color: "#AAA", mr: 2}}/>}
                    </IconButton>
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
                                        window.location.href = mi[1].isActive ? `/gitea/logout/${mi[0]}/` : `/gitea/login/${mi[0]}/${currentUrl}`;
                                    }}
                                >{
                                    `${mi[0]} ${mi[1].isActive ? "✓" : "❌"}`
                                }</MenuItem>
                            )
                    }
                    </Menu>
                </Box>
                <Box sx={{m: 0, p: 0}}>
                    <InternetSwitch
                        internet={enabledRef.current}
                        setInternet={
                            () => postEmptyJson(enabledRef.current ? '/net/disable' : '/net/enable', debugRef.current)
                        }
                    />
                </Box>
                <IconButton sx={{m: 0, p: 0}}>
                    {
                        <SettingsIcon
                            color="inherit"
                            aria-label="settings"
                            onClick={
                                () => {
                                    window.location.href = "/clients/settings"
                                }
                            }
                            disabled={currentId.includes("settings")}
                            sx={{ml: 2, color: currentId.includes("settings") ? "#AAA" : "#FFF"}}
                        />
                    }
                </IconButton>
            </Toolbar>
        </AppBar>
    </Box>
}

export default Header;