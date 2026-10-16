const {test} = require("node:test");
const assert = require("node:assert/strict");
const {doInterpolatedI18n} = require("../dist/lib/i18nLib");

test("interpolates values in a localized template", () => {
    assert.equal(
        doInterpolatedI18n("greeting", ["cat", "mat"], {
            greeting: "The %1% sat on the %2%"
        }),
        "The cat sat on the mat"
    );
});

test("uses numbered placeholders to reorder interpolation values", () => {
    assert.equal(
        doInterpolatedI18n("greeting", ["cat", "mat"], {
            greeting: "The %2% sat on the %1%"
        }),
        "The mat sat on the cat"
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
    assert.throws(() => doInterpolatedI18n("The %1%", [42]), TypeError);
    assert.throws(() => doInterpolatedI18n("The %1%", [null]), TypeError);
    assert.throws(() => doInterpolatedI18n("The %1%", Array(1)), TypeError);
});

test("rejects a mismatch between placeholders and values", () => {
    assert.throws(
        () => doInterpolatedI18n("greeting", ["cat"], {greeting: "The %1% sat on the %2%"}),
        RangeError
    );
    assert.throws(
        () => doInterpolatedI18n("greeting", ["cat", "mat"], {greeting: "The %1%"}),
        RangeError
    );
    assert.throws(
        () => doInterpolatedI18n("greeting", ["cat"], {greeting: "The %2%"}),
        RangeError
    );
});
