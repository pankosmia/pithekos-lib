async function postEmptyJson(url, debug=false) {
    try {
        const response = await fetch(url, {method: "POST"});
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status,
                error: await response.text()
            };
            if (debug) {
                console.log("postEmptyJson", result);
            }
            return result;
        }
        const result = {
            url,
            ok: true,
            status: response.status,
            json: await response.json()
        };
        if (debug) {
            console.log("postEmptyJson", result);
        }
        return result;
    } catch (err) {
        const result = {
            url,
            ok: false,
            status: 0,
            error: err.message
        };
        if (debug) {
            console.log("postEmptyJson", result);
        }
        return result;
    }
}

async function postJson(url, body, debug=false, contentType = "application/json") {
    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {"Content-Type": contentType},
                body});
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status,
                error: await response.text()
            };
            if (debug) {
                console.log("postJson", result);
            }
            return result;
        }
        const result = {
            url,
            ok: true,
            status: response.status,
            json: await response.json()
        };
        if (debug) {
            console.log("postJson", result);
        }
        return result;
    } catch (err) {
        const result = {
            url,
            ok: false,
            status: 0,
            error: err.message
        };
        if (debug) {
            console.log("postJson", result);
        }
        return result;
    }
}

async function postText(url, body, debug=false, contentType = "text/plain") {
    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {"Content-Type": contentType},
                body});
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status,
                error: await response.text()
            };
            if (debug) {
                console.log("postText", result);
            }
            return result;
        }
        const result = {
            url,
            ok: true,
            status: response.status,
            text: await response.text()
        };
        if (debug) {
            console.log("postText", result);
        }
        return result;
    } catch (err) {
        const result = {
            url,
            ok: false,
            status: 0,
            error: err.message
        };
        if (debug) {
            console.log("postText", result);
        }
        return result;
    }
}

export {postEmptyJson, postJson, postText};
