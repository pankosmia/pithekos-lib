const {test} = require("node:test");
const assert = require("node:assert/strict");
const {doInterpolatedI18n} = require("../dist/lib/i18nLib");

test("interpolates values in a localized template", () => {
    assert.equal(
        doInterpolatedI18n("greeting", ["cat", "mat"], {
            greeting: "The %% sat on the %%"
        }),
        "The cat sat on the mat"
    );
});

test("reports a missing localized template before validating placeholders", () => {
    assert.throws(
        () => doInterpolatedI18n("missing:key", ["cat"]),
        {message: "No localized string found for key: missing:key"}
    );
});

test("returns a template without placeholders when given no values", () => {
    assert.equal(doInterpolatedI18n("Hello", [], {Hello: "Hello"}), "Hello");
});

test("rejects non-array interpolation values", () => {
    assert.throws(() => doInterpolatedI18n("Hello", "there"), TypeError);
});

test("rejects non-string interpolation values", () => {
    assert.throws(() => doInterpolatedI18n("The %%", [42]), TypeError);
    assert.throws(() => doInterpolatedI18n("The %%", [null]), TypeError);
    assert.throws(() => doInterpolatedI18n("The %%", Array(1)), TypeError);
});

test("rejects a mismatch between placeholders and values", () => {
    assert.throws(
        () => doInterpolatedI18n("greeting", ["cat"], {greeting: "The %% sat on the %%"}),
        RangeError
    );
    assert.throws(
        () => doInterpolatedI18n("greeting", ["cat", "mat"], {greeting: "The %%"}),
        RangeError
    );
});
