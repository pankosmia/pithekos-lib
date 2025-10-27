import React, {useContext, useEffect, useState} from "react";
import NetContext from "../contexts/netContext";
import DebugContext from "../contexts/debugContext";
import I18nContext from "../contexts/i18nContext";
import {
    AppBar,
    Box,
    Drawer,
    Stack,
    IconButton,
    List,
    ListItem,
    ListItemButton, ListItemText,
    Switch,
    Toolbar,
    Typography,
    Collapse
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {doI18n} from "../lib/i18nLib";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {getJson} from "../lib/getLib";
import {postEmptyJson} from "../lib/postLib";
import InternetSwitch from "./InternetSwitch";

function Header({titleKey, widget, currentId}) {
    const {enabledRef} = useContext(NetContext);
    const {debugRef} = useContext(DebugContext);
    const {i18nRef} = useContext(I18nContext);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [showAdvanced, setShowAdvanced] = useState(true);
    const [internetDialogOpen, setInternetDialogOpen] = useState(false);

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
    );

    const currentUrl = menuItems.filter(i => i.id === currentId).length === 1 ? menuItems.filter(i => i.id === currentId)[0].url : "";

    const disableInternet = () => {
        postEmptyJson('/net/disable', debugRef.current)
    };

    const enableInternet = () => {
        postEmptyJson('/net/enable', debugRef.current)
    };

    const toggleDebug = (ev) => {
        getJson(`/debug/${debugRef.current ? "disable" : "enable"}`)
            .then(
                () => {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            );
    };

    const handleInternetToggleClick = () => {
        if (!enabledRef.current) {
            setInternetDialogOpen(true);
        } else {
            disableInternet();
        }
    };

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
                        <Box sx={{width: 250, minHeight: '98vh', m: 0, p: 0}} role="presentation">                         
                            <List sx={{ height: '100%', width: '100%' }}>
                                <Stack
                                    direction="column"
                                    spacing={0}
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                    }}
                                > 
                                    <Box sx={{width: '100%'}}>
                                        {
                                            menuItems
                                            .map(
                                                (mi, n) => mi.id === currentId ?
                                                    <ListItem key={n} disablePadding onClick={() => setDrawerIsOpen(false)}>
                                                        <ListItemButton selected={true} >
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
                                    </Box>
                                    <Box>
                                        <ListItem disablePadding >
                                            <ListItemButton 
                                                selected={currentId.includes("settings")} 
                                                onClick={ () => { window.location.href = "/clients/settings" }} 
                                            >
                                                <ListItemText primary={doI18n("pages:core-settings:title", i18nRef.current)}/>
                                            </ListItemButton> 
                                        </ListItem>
                                        <ListItem disablePadding >
                                            <ListItemButton onClick={() => setShowAdvanced(a => !a)} >
                                                <ListItemText primary={doI18n(`components:header:advanced`, i18nRef.current)}/>
                                                {showAdvanced ? <ExpandLess /> : <ExpandMore />}
                                            </ListItemButton>
                                        </ListItem>
                                        <Collapse in={showAdvanced} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                <ListItemButton onClick={toggleDebug} sx={{ pl:4 }}>
                                                    <ListItemText primary={doI18n(`components:header:experimental_mode`, i18nRef.current)} />
                                                    <Switch
                                                        edge="end"
                                                        onChange={toggleDebug}
                                                        checked={debugRef.current}
                                                    />
                                                </ListItemButton>
                                            </List>
                                        </Collapse>
                                    </Box>
                                </Stack>
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
                    <InternetSwitch
                        enableInternet={enableInternet}
                        handleInternetToggleClick={handleInternetToggleClick}
                        internetDialogOpen={internetDialogOpen}
                        setInternetDialogOpen={setInternetDialogOpen}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    </Box>
}

export default Header;