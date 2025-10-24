import {useContext} from 'react';
import { Box, Chip } from "@mui/material";
import AirplanemodeInactiveOutlinedIcon from '@mui/icons-material/AirplanemodeInactiveOutlined';
import AirplanemodeActiveOutlinedIcon from '@mui/icons-material/AirplanemodeActiveOutlined';
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
        <Box>
            <Chip
                icon={enabledRef.current ? <AirplanemodeInactiveOutlinedIcon /> : <AirplanemodeActiveOutlinedIcon />}
                label={doI18n("components:header:offline_mode", i18nRef.current)}
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
        </Box>
    )
}