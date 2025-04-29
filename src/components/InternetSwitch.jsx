import React, { useState, useContext } from 'react';
import { Box, Switch, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, FormControlLabel } from "@mui/material";
import {i18nContext, doI18n} from "../index";

export default function InternetSwitch({internet, setInternet}) {

    const [open, setOpen] = useState(false);
    const {i18nRef} = useContext(i18nContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = () => {
        if (!internet) {
            handleClickOpen()
        } else {
            setInternet(false);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    borderRadius: 2,
                    backgroundColor: "#9E9E9E",
                    p: 1,
                    pr: 3,
                    pl: 3,
                    m: 0
                }}
            >
                <FormControlLabel
                    sx={{m:0}}
                    control={
                        <Switch checked={internet} onChange={handleChange} color="warning" size="small" />
                    }
                    label={doI18n(internet ? "components:header:connected" : "components:header:disconnected", i18nRef.current)}
                />
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',

                    },
                }}
            >
                <DialogTitle><b>{doI18n("components:header:internet_question_label", i18nRef.current)}</b></DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>
                            {doI18n("components:header:internet_question", i18nRef.current)}
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{doI18n("components:header:cancel", i18nRef.current)}</Button>
                    <Button onClick={() => { setInternet(true); handleClose() }}>{doI18n("components:header:accept", i18nRef.current)}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}