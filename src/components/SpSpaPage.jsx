import React, {useContext, useEffect, useState} from "react";
import I18nContext from "../contexts/i18nContext";
import NetContext from "../contexts/netContext";
import {Box, Grid2, Paper} from "@mui/material";
import {BlockOutlined} from "@mui/icons-material";
import {doI18n} from "../lib/i18nLib";
import {useSnackbar} from "notistack";
import DebugContext from "../contexts/debugContext";
import BcvContext from "../contexts/bcvContext";
import MessagesContext from "../contexts/messagesContext";
import Header from "./Header";

function AppWrapper({children, netValue, debugValue, i18n}) {

    const [systemBcv, setSystemBcv] = useState({
        bookCode: "TIT",
        chapterNum: 1,
        verseNum: 1
    });
    const bcvValue = {systemBcv, setSystemBcv};
    const [messages, setMessages] = useState([]);
    const messageValue = {messages, setMessages};
    const {enqueueSnackbar} = useSnackbar();
    const localHandler = s => {
        const dataBits = s.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "top", horizontal: "left"}
                }
            );
        }
    }

    useEffect(() => {
            if (messages.length > 0) {
                messages.forEach(m => localHandler(m));
                setMessages([]);
            }
        },
        [messages]
    )

    return <DebugContext.Provider value={debugValue}>
        <NetContext.Provider value={netValue}>
            <BcvContext.Provider value={bcvValue}>
                <MessagesContext.Provider value={messageValue}>
                    <I18nContext.Provider value={i18n}>
                        <Box sx={{height: '100vh', overflow: 'hidden'}}>
                            {children}
                        </Box>
                    </I18nContext.Provider>
                </MessagesContext.Provider>
            </BcvContext.Provider>
        </NetContext.Provider>
    </DebugContext.Provider>
}

function SpSpaPage({subtitleKey, widget, margin = 2, children, requireNet = false, netValue, debugValue, i18n}) {
    const {enableNet} = netValue;
    if (requireNet && !enableNet) {
        return (
            <AppWrapper
                netValue={netValue}
                debugValue={debugValue}
                i18n={i18n}
            >
                <Paper>
                    <Box sx={{
                        m: margin,
                        height: "100%",
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}>
                        <Grid2 container spacing={0} direction="column" alignItems="center" justifyContent="center"
                               sx={{minHeight: '100vh'}}>
                            <Grid2 item>
                                <Box>
                                    <BlockOutlined fontSize="large" color="warning"/>
                                    <p>{doI18n("components:framework:no_entry_if_offline", i18n)}</p>
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Paper>
            </AppWrapper>
        );
    }
    return (
        <AppWrapper
            netValue={netValue}
            debugValue={debugValue}
            i18n={i18n}
        >
            <Paper>
                <Box>
                    <Header
                        subtitle={subtitleKey || null}
                        widget={widget || null}
                        margin={margin || 2}
                    />
                </Box>
                <Box sx={{
                    m: margin,
                    height: "100%",
                    overflowX: "hidden",
                    overflowY: "auto",
                }}>
                    {children}
                </Box>
            </Paper>
        </AppWrapper>
    );
}

export default SpSpaPage;
