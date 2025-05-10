import React, {useEffect, useRef, useState} from "react";
import {getJson} from "../lib/getLib";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import AppWrapper from './AppWrapper';
import dcopy from 'deep-copy';

function Spa({children}) {
    const [enableNet, _setEnableNet] = useState(false);
    const enabledRef = useRef(enableNet);
    const setEnableNet = nv => {
        enabledRef.current = nv;
        _setEnableNet(nv);
    };
    const [debug, _setDebug] = useState(false);
    const debugRef = useRef(debug);
    const setDebug = nv => {
        debugRef.current = nv;
        _setDebug(nv);
    };
    const [auth, _setAuth] = useState({});
    const authRef = useRef(auth);
    const setAuth = nv => {
        authRef.current = nv;
        _setAuth(nv);
    };
    const [systemBcv, _setSystemBcv] = useState({
        bookCode: "TIT",
        chapterNum: 1,
        verseNum: 1
    });
    const bcvRef = useRef(systemBcv);
    const setSystemBcv = nv => {
        bcvRef.current = nv;
        _setSystemBcv(nv);
    };
    const [i18n, _setI18n] = useState({});
    const i18nRef = useRef(i18n);
    const setI18n = nv => {
        i18nRef.current = nv;
        _setI18n(nv);
    };
    const [typography, _setTypography] = useState({
        font_set: "Pankosmia-CardoPankosmia-EzraSILPankosmia-PadaukPankosmia-AwamiNastaliqPankosmia-NotoNastaliqUrduPankosmia-GentiumPlus",
        size: "medium",
        direction: "ltr"
    });
    const typographyRef = useRef(typography);
    const setTypography = nv => {
        typographyRef.current = nv;
        _setTypography(nv);
    };

    const [currentProject, _setCurrentProject] = useState(null);
    const currentProjectRef = useRef(currentProject);
    const setCurrentProject = nv => {
        currentProjectRef.current = nv;
        _setCurrentProject(nv);
    };

    const doFetchI18n = async () => {
        const i18nResponse = await getJson("/i18n/flat", debugRef.current);
        if (i18nResponse.ok) {
            setI18n(i18nResponse.json);
        } else {
            enqueueSnackbar(
                `Could not load i18n: ${i18nResponse.error}`,
                {
                    variant: "error",
                    anchorOrigin: {vertical: "bottom", horizontal: "left"},
                    persist: true
                }
            )
        }
    }

    const doFetchTypography = async () => {
        const typoResponse = await getJson("/settings/typography", debugRef.current);
        if (typoResponse.ok) {
            setI18n(typoResponse.json);
        } else {
            enqueueSnackbar(
                `Could not load typography: ${typoResponse.error}`,
                {
                    variant: "error",
                    anchorOrigin: {vertical: "bottom", horizontal: "left"},
                    persist: true
                }
            )
        }
    }

    useEffect(
        () => {
            doFetchI18n().then();
            doFetchTypography().then();
        },
        []
    );

    useEffect(
        () => {
            const doFetchBcv = async () => {
                const bcvResponse = await getJson("/navigation/bcv", debugRef.current);
                if (bcvResponse.ok) {
                    const serverOb = bcvResponse.json;
                    setSystemBcv({
                        bookCode: serverOb.book_code,
                        chapterNum: serverOb.chapter,
                        verseNum: serverOb.verse
                    });
                } else {
                    enqueueSnackbar(
                        `Could not load bcv: ${bcvResponse.error}`,
                        {
                            variant: "error",
                            anchorOrigin: {vertical: "bottom", horizontal: "left"},
                            persist: true
                        }
                    )
                }
            }
            doFetchBcv().then();
        },
        []
    );

    const statusHandler = ev => {
        const statusBits = ev.data.split('--');
        if (statusBits.length === 4) {
            const netStatus = (statusBits[1] === "enabled");
            if (netStatus !== enabledRef.current) {
                setEnableNet(netStatus);
            }
            const debugStatus = (statusBits[3] === "enabled");
            if (debugStatus !== debugRef.current) {
                setDebug(debugStatus);
            }
        }
    }

    const bcvHandler = ev => {
        const bcvBits = ev.data.split('--');
        if (bcvBits.length === 3) {
            const newBcv = {
                bookCode: bcvBits[0],
                chapterNum: parseInt(bcvBits[1]),
                verseNum: parseInt(bcvBits[2])
            };
            if ((newBcv.bookCode !== bcvRef.current.bookCode) || (newBcv.chapterNum !== bcvRef.current.chapterNum) || (newBcv.verseNum !== bcvRef.current.verseNum)) {
                setSystemBcv(newBcv);
            }
        }
    }

    const typographyHandler = ev => {
        const typographyBits = ev.data.split('--');
        if (typographyBits.length === 3) {
            const newTypography = {
                font_set: typographyBits[0],
                size: typographyBits[1],
                direction: typographyBits[2]
            };
            if ((newTypography.font_set !== typographyRef.current.font_set) || (newTypography.size !== typographyRef.current.size) || (newTypography.direction !== typographyRef.current.direction)) {
                setTypography(newTypography);
            }
        }
    }

    const languagesHandler = () => {
        doFetchI18n().then()
    }

    const authHandler = ev => {
        try {
            const newAuth = dcopy(authRef.current);
            const [authName, authEndpoint, authState] = ev.data.split('--');
            if (["true", "false"].includes(authState)) {
                const authBool = (authState === "true");
                if (!(authName in newAuth) || !("isActive" in newAuth[authName]) || authBool !== newAuth[authName].isActive) {
                    newAuth[authName] = {endpoint: authEndpoint, isActive: authBool};
                    setAuth(newAuth);
                }
            }
        } catch (err) {
            console.log(`Auth Error: ${err}, data: ${ev.data}`)
        }
    }

    const currentProjectHandler = ev => {
        if (ev.data === null) {
            if (!(currentProjectRef.current === null)) { // different types so must be different
                setCurrentProject(null);
            } // Otherwise both are null so no-op
        } else { // ev.data is not null
            const currentProjectBits = ev.data.split('--');
            if (currentProjectBits.length === 3) {
                let newCurrentProject = {
                    source: currentProjectBits[0],
                    organization: currentProjectBits[1],
                    project: currentProjectBits[2]
                };
                if ((!currentProjectRef.current || newCurrentProject.source !== currentProjectRef.current.source) || (newCurrentProject.organization !== currentProjectRef.current.organization) || (newCurrentProject.project !== currentProjectRef.current.project)) {
                    setCurrentProject(newCurrentProject);
                }
            } else {
                setCurrentProject(null);
            }
        }
    }

    const miscHandler = ev => {
        const dataBits = ev.data.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "bottom", horizontal: "left"},
                    persist: dataBits[0] === "error"
                }
            );
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const fetchSSE = async () => {
            await fetchEventSource("/notifications", {
                method: "GET",
                headers: {
                    Accept: "text/event-stream",
                },
                onopen(res) {
                    if (res.ok && res.status === 200) {
                        // console.log("Connected to SSE");
                    } else if (
                        res.status >= 400 &&
                        res.status < 500 &&
                        res.status !== 429
                    ) {
                        console.log("Error from SSE", res.status);
                    }
                },
                onmessage(event) {
                    if (event.event === "misc") {
                        miscHandler(event)
                    } else if (event.event === "status") {
                        statusHandler(event)
                    } else if (event.event === "bcv") {
                        bcvHandler(event)
                    } else if (event.event === "auth") {
                        authHandler(event)
                    } else if (event.event === "languages") {
                        languagesHandler(event)
                    } else if (event.event === "typography") {
                        typographyHandler(event)
                    } else if (event.event === "current_project") {
                        currentProjectHandler(event)
                    }

                },
                onclose() {
                    console.log("SSE connection closed by the server");
                },
                onerror(err) {
                    console.log("There was an error from the SSE server", err);
                },
            });
        };
        fetchSSE();
        return () => controller.abort();
    }, []);

    const netValue = {enableNet, setEnableNet, enabledRef};
    const debugValue = {debug, setDebug, debugRef};
    const bcvValue = {systemBcv, setSystemBcv, bcvRef};
    const authValue = {auth, setAuth, authRef};
    const i18nValue = {i18n, setI18n, i18nRef};
    const typographyValue = {typography, setTypography, typographyRef};
    const currentProjectValue = {currentProject, setCurrentProject, currentProjectRef}

    debugRef.current && console.log("Rerender Spa");


    return <SnackbarProvider maxSnack={6}>
        <AppWrapper
            netValue={netValue}
            debugValue={debugValue}
            i18nValue={i18nValue}
            bcvValue={bcvValue}
            authValue={authValue}
            typographyValue={typographyValue}
            currentProjectValue={currentProjectValue}
        >
            {children}
        </AppWrapper>
    </SnackbarProvider>
}

export default Spa;