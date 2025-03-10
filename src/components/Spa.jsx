import React, {useEffect, useRef, useState} from "react";
import {getJson, getAndSetJson} from "../lib/getLib";
import {enqueueSnackbar, SnackbarProvider} from "notistack";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import AppWrapper from './AppWrapper';
import dcopy from 'deep-copy';

function Spa({children}) {
    console.log("Rerender Spa")
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
        bookCode: "JHN",
        chapterNum: 3,
        verseNum: 16
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
    const [languages, setLanguages] = useState("en");

    const doFetchI18n = async () => {
        console.log("doFetchI18n")
        const i18nResponse = await getJson("/i18n/flat", debugRef.current);
        if (i18nResponse.ok) {
            setI18n(i18nResponse.json);
        } else {
            enqueueSnackbar(
                `Could not load i18n: ${i18nResponse.error}`,
                {variant: "error"}
            )
        }
    }

    useEffect(
        () => {
            doFetchI18n().then();
        },
        []
    );

    useEffect(
        () => {
            const doFetchBcv = async () => {
                const bcvResponse = await getJson("/navigation/bcv", debugRef.current);
                if (bcvResponse.ok) {
                    setSystemBcv(bcvResponse.json);
                } else {
                    enqueueSnackbar(
                        `Could not load bcv: ${bcvResponse.error}`,
                        {variant: "error"}
                    )
                }
            }
            doFetchBcv().then();
        },
        []
    );

    const netHandler = ev => {
        if (ev.data === "enabled" && !enabledRef.current) {
            setEnableNet(true);
        } else if (ev.data === "disabled" && enabledRef.current) {
            setEnableNet(false);
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

    const debugHandler = ev => {
        if (ev.data === "enabled" && !debugRef.current) {
            setDebug(true);
        } else if (ev.data === "disabled" && debugRef.current) {
            setDebug(false);
        }
    }

    const languagesHandler = ev => {
        console.log("languagesHandler");
        if (ev.data !== languages) {
            console.log("languagesHandler change", ev.data, languages);
            setLanguages(ev.data);
            doFetchI18n().then();
        }
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

    const miscHandler = ev => {
        const dataBits = ev.data.split('--');
        if (dataBits.length === 4) {
            enqueueSnackbar(
                `${dataBits[2]} => ${dataBits[3]}`,
                {
                    variant: dataBits[0],
                    anchorOrigin: {vertical: "bottom", horizontal: "right"}
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
                    } else if (event.event === "net_status") {
                        netHandler(event)
                    } else if (event.event === "debug") {
                        debugHandler(event)
                    } else if (event.event === "bcv") {
                        bcvHandler(event)
                    } else if (event.event === "auth") {
                        authHandler(event)
                    } else if (event.event === "languages") {
                        languagesHandler(event)
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

    return <SnackbarProvider maxSnack={3}>
        <AppWrapper
            netValue={netValue}
            debugValue={debugValue}
            i18nValue={i18nValue}
            bcvValue={bcvValue}
            authValue={authValue}
        >
            {children}
        </AppWrapper>
    </SnackbarProvider>
}

export default Spa;