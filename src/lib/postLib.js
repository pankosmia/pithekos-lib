async function postEmptyJson(url, debug=false) {
    try {
        const response = await fetch(url, {method: "POST"});
        if (!response.ok) {
            const result = {
                url,
                ok: false,
                status: response.status
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

export {postEmptyJson};
