import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import DebugContext from "../contexts/debugContext";
import NetContext from "../contexts/netContext";
import BcvContext from "../contexts/bcvContext";
import MessagesContext from "../contexts/messagesContext";
import I18nContext from "../contexts/i18nContext";
import AuthContext from "../contexts/authContext";
import TypographyContext from "../contexts/typographyContext";
import {Box} from "@mui/material";

function AppWrapper({children, netValue, debugValue, bcvValue, i18nValue, authValue, typographyValue}) {

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

    return <I18nContext.Provider value={i18nValue}>
        <TypographyContext.Provider value={typographyValue}>
            <AuthContext.Provider value={authValue}>
                <BcvContext.Provider value={bcvValue}>
                    <MessagesContext.Provider value={messageValue}>
                        <DebugContext.Provider value={debugValue}>
                            <NetContext.Provider value={netValue}>
                                <Box sx={{height: '100vh', overflow: 'hidden'}}>
                                    {children}
                                </Box>
                            </NetContext.Provider>
                        </DebugContext.Provider>
                    </MessagesContext.Provider>
                </BcvContext.Provider>
            </AuthContext.Provider>
        </TypographyContext.Provider>
    </I18nContext.Provider>
}

export default AppWrapper;