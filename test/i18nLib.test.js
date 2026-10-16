const {test} = require("node:test");
const assert = require("node:assert/strict");
const {do_interpolated_i18n} = require("../dist/lib/i18nLib");

test("interpolates values in a localized template", () => {
    assert.equal(
        do_interpolated_i18n("greeting", ["cat", "mat"], {
            greeting: "The %% sat on the %%"
        }),
        "The cat sat on the mat"
    );
});

test("uses the key when no localized template is available", () => {
    assert.equal(do_interpolated_i18n("The %% sat", ["cat"]), "The cat sat");
});

test("returns a template without placeholders when given no values", () => {
    assert.equal(do_interpolated_i18n("Hello", []), "Hello");
});

test("rejects non-array interpolation values", () => {
    assert.throws(() => do_interpolated_i18n("Hello", "there"), TypeError);
});

test("rejects non-string interpolation values", () => {
    assert.throws(() => do_interpolated_i18n("The %%", [42]), TypeError);
    assert.throws(() => do_interpolated_i18n("The %%", [null]), TypeError);
});

test("rejects a mismatch between placeholders and values", () => {
    assert.throws(() => do_interpolated_i18n("The %% sat on the %%", ["cat"]), RangeError);
    assert.throws(() => do_interpolated_i18n("The %%", ["cat", "mat"]), RangeError);
});
