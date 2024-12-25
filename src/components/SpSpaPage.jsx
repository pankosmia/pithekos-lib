import React, {useContext} from "react";
import {Box, Grid2, Paper} from "@mui/material";
import {BlockOutlined} from "@mui/icons-material";
import {doI18n} from "../lib/i18nLib";
import Header from "./Header";
import netContext from "../contexts/netContext";


function SpSpaPage({subtitleKey, widget, margin = 2, children, requireNet=false}) {
    const {enableNet} = useContext(netContext);
    if (requireNet && !enableNet) {
        return (
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
        );
    }
    return (
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
    );
}

export default SpSpaPage;
