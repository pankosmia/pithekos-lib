import React from "react";
import {SnackbarProvider} from "notistack";
import SpSpaPage from "./SpSpaPage";
import Spa from "./Spa";

function SpSpa({children, subtitleKey, requireNet}) {

    return <SnackbarProvider maxSnack={3}>
        <Spa>
            <SpSpaPage
                subtitleKey={subtitleKey}
                requireNet={requireNet}
            >
                {children}
            </SpSpaPage>
        </Spa>
    </SnackbarProvider>
}

export default SpSpa;