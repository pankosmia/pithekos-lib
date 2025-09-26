import React, {useState, useContext} from 'react';
import {
    Switch,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    ListItemText,

} from "@mui/material";
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
        <>
            <ListItemText primary={doI18n("components:header:connected", i18nRef.current)} />
            <Switch 
                edge="end"
                onChange={handleChange}
                checked={internet}
            />
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
                    <Button onClick={() => {
                        setInternet(true);
                        handleClose()
                    }}>{doI18n("components:header:accept", i18nRef.current)}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}