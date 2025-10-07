import React, {useContext} from 'react';
import {
    Switch,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    ListItem,
    ListItemText,

} from "@mui/material";
import i18nContext from "../contexts/i18nContext";
import netContext from "../contexts/netContext";
import {doI18n} from "../lib/i18nLib";


export default function InternetSwitch({enableInternet, handleInternetToggleClick, internetDialogOpen, setInternetDialogOpen}) {

    const {i18nRef} = useContext(i18nContext);
    const {enabledRef} = useContext(netContext);

    const handleClose = () => {
        setInternetDialogOpen(false);
    };

    return (
        <ListItem>
            <ListItemText
                primary={doI18n("components:header:offline_mode", i18nRef.current)}
            />
            <Switch 
                edge="end"
                checked={!enabledRef.current}
                onClick={handleInternetToggleClick}
            />
            <Dialog
                open={internetDialogOpen}
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
                        enableInternet();
                        handleClose();
                    }}>{doI18n("components:header:accept", i18nRef.current)}</Button>
                </DialogActions>
            </Dialog>
        </ListItem>
    )
}