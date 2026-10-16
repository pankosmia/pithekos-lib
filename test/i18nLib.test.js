const test = require("tape");
const {doInterpolatedI18n} = require("../dist/lib/i18nLib");

test("interpolates values in a localized template", (t) => {
    t.equal(
        doInterpolatedI18n("greeting", ["cat", "mat"], {
            greeting: "The %1% sat on the %2%"
        }),
        "The cat sat on the mat"
    );
    t.end();
});

test("uses numbered placeholders to reorder interpolation values", (t) => {
    t.equal(
        doInterpolatedI18n("greeting", ["cat", "mat"], {
            greeting: "The %2% sat on the %1%"
        }),
        "The mat sat on the cat"
    );
    t.end();
});

test("reports a missing localized template before validating placeholders", (t) => {
    t.throws(
        () => doInterpolatedI18n("missing:key", ["cat"]),
        /No localized string found for key: missing:key/
    );
    t.end();
});

test("returns a template without placeholders when given no values", (t) => {
    t.equal(doInterpolatedI18n("Hello", [], {Hello: "Hello"}), "Hello");
    t.end();
});

test("rejects non-array interpolation values", (t) => {
    t.throws(() => doInterpolatedI18n("Hello", "there"), TypeError);
    t.end();
});

test("rejects non-string interpolation values", (t) => {
    t.throws(() => doInterpolatedI18n("The %1%", [42]), TypeError);
    t.throws(() => doInterpolatedI18n("The %1%", [null]), TypeError);
    t.throws(() => doInterpolatedI18n("The %1%", Array(1)), TypeError);
    t.end();
});

test("rejects a mismatch between placeholders and values", (t) => {
    t.throws(
        () => doInterpolatedI18n("greeting", ["cat"], {greeting: "The %1% sat on the %2%"}),
        RangeError
    );
    t.throws(
        () => doInterpolatedI18n("greeting", ["cat", "mat"], {greeting: "The %1%"}),
        RangeError
    );
    t.throws(
        () => doInterpolatedI18n("greeting", ["cat"], {greeting: "The %2%"}),
        RangeError
    );
    t.end();
});

test("rejects malformed interpolation placeholders", (t) => {
    t.throws(
        () => doInterpolatedI18n("greeting", [], {greeting: "Hello %%"}),
        /Invalid interpolation placeholder: %%/
    );
    t.throws(
        () => doInterpolatedI18n("greeting", [], {greeting: "Hello %foo%"}),
        /Invalid interpolation placeholder: %foo%/
    );
    t.end();
});
