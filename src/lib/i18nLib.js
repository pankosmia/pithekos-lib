const doI18n = (key, source) => source[key] || key;

const do_interpolated_i18n = (key, values, source = {}) => {
    if (!Array.isArray(values)) {
        throw new TypeError("Interpolation values must be an array of strings");
    }
    for (const value of values) {
        if (typeof value !== "string") {
            throw new TypeError("Interpolation values must be strings");
        }
    }

    const template = doI18n(key, source);
    if (typeof template !== "string") {
        throw new TypeError("The localized string template must be a string");
    }

    const placeholders = template.match(/%%/g) || [];
    if (placeholders.length !== values.length) {
        throw new RangeError("The number of interpolation values must match the placeholders");
    }

    let index = 0;
    return template.replace(/%%/g, () => values[index++]);
};

export {doI18n, do_interpolated_i18n};