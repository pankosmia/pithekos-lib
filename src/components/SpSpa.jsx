import React from "react";
import {SnackbarProvider} from "notistack";
import SpaContainer from "./SpaContainer";
import SpSpaPage from "./SpSpaPage";

function SpSpa({children, titleKey, requireNet, currentId, widget, margin}) {

    return <SpaContainer>
            <SpSpaPage
                titleKey={titleKey}
                requireNet={requireNet}
                currentId={currentId}
                widget={widget || null}
                margin={margin || 0}
            >
                {children}
            </SpSpaPage>
        </SpaContainer>
}

export default SpSpa;