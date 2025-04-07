import React from "react";
import {SnackbarProvider} from "notistack";
import Spa from "./Spa";

function SpaContainer({children}) {

    return <SnackbarProvider maxSnack={3}>
        <Spa>
            {children}
        </Spa>
    </SnackbarProvider>
}

export default SpaContainer;