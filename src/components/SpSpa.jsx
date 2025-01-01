import React from "react";
import {SnackbarProvider} from "notistack";
import SpSpaPage from "./SpSpaPage";
import Spa from "./Spa";

function SpSpa({children, titleKey, requireNet, currentId}) {

    return <SnackbarProvider maxSnack={3}>
        <Spa>
            <SpSpaPage
                titleKey={titleKey}
                requireNet={requireNet}
                currentId={currentId}
            >
                {children}
            </SpSpaPage>
        </Spa>
    </SnackbarProvider>
}

export default SpSpa;