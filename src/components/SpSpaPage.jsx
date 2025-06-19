import React, {useContext} from "react";
import {Box, Grid2} from "@mui/material";
import {BlockOutlined} from "@mui/icons-material";
import {doI18n} from "../lib/i18nLib";
import Header from "./Header";
import netContext from "../contexts/netContext";
import i18nContext from "../contexts/i18nContext";


function SpSpaPage({titleKey, widget, margin = 2, children, requireNet = false, currentId}) {
    const {enableNet} = useContext(netContext);
    const i18n = useContext(i18nContext);
    if (requireNet && !enableNet) {
        return (<Box sx={{
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
        );
    }
    return (<>
            <Box>
                <Header
                    titleKey={titleKey || null}
                    widget={widget || null}
                    currentId={currentId}
                />
            </Box>
            <Box sx={{
                m: margin,
                overflowX: "hidden",
                overflowY: "auto",
            }}>
                {children}
            </Box>
        </>
    );
}

export default SpSpaPage;
