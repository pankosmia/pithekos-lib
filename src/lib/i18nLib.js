const doI18n = (key, source) => source[key] || key;

const doInterpolatedI18n = (key, values, source = {}) => {
    if (!Array.isArray(values)) {
        throw new TypeError("Interpolation values must be an array of strings");
    }
    for (const value of values) {
        if (typeof value !== "string") {
            throw new TypeError("Interpolation values must be strings");
        }
    }

    const template = source && source[key];
    if (!template) {
        throw new Error(`No localized string found for key: ${key}`);
    }

    if (typeof template !== "string") {
        throw new TypeError("The localized string template must be a string");
    }

    const placeholders = template.match(/%\d+%/g) || [];
    if (placeholders.length !== values.length) {
        throw new RangeError("The number of interpolation values must match the placeholders");
    }

    return template.replace(/%(\d+)%/g, (placeholder, position) => {
        const index = Number(position) - 1;
        if (index < 0 || index >= values.length) {
            throw new RangeError(`Placeholder ${placeholder} has no matching interpolation value`);
        }
        return values[index];
    });
};

export {doI18n, doInterpolatedI18n};