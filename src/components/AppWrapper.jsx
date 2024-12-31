import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import DebugContext from "../contexts/debugContext";
import NetContext from "../contexts/netContext";
import BcvContext from "../contexts/bcvContext";
import MessagesContext from "../contexts/messagesContext";
import I18nContext from "../contexts/i18nContext";
import {Box} from "@mui/material";

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
                    anchorOrigin: {vertical: "bottom", horizontal: "right"}
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

export default AppWrapper;