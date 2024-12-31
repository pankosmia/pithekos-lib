import React from "react";
import {SnackbarProvider} from "notistack";
import SpSpaPage from "./SpSpaPage";
import Spa from "./Spa";

function SpSpa({children, subtitleKey, requireNet, currentId}) {

    return <SnackbarProvider maxSnack={3}>
        <Spa>
            <SpSpaPage
                subtitleKey={subtitleKey}
                requireNet={requireNet}
                currentId={currentId}
            >
                {children}
            </SpSpaPage>
        </Spa>
    </SnackbarProvider>
}

export default SpSpa;