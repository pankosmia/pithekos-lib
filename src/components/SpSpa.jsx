import React from "react";
import {SnackbarProvider} from "notistack";
import SpSpaPage from "./SpSpaPage";
import Spa from "./Spa";

function SpSpa({children, titleKey, requireNet, currentId, widget, margin}) {

    return <SnackbarProvider maxSnack={3}>
        <Spa>
            <SpSpaPage
                titleKey={titleKey}
                requireNet={requireNet}
                currentId={currentId}
                widget={widget || null}
                margin={margin || 2}
            >
                {children}
            </SpSpaPage>
        </Spa>
    </SnackbarProvider>
}

export default SpSpa;