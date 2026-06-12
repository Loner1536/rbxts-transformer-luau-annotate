"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = assert;
/**
 * Asserts the truthiness of `value`, stops the debugger on failure.
 * @param value The value to check the truthiness of
 * @param message Optional. The message of the error
 */
function assert(value, message) {
    /* istanbul ignore if */
    if (!value) {
        debugger;
        throw new Error("Assertion Failed! ".concat(message !== null && message !== void 0 ? message : "") +
            "\nPlease submit a bug report here:" +
            "\nhttps://github.com/rbxts-flamework/core/issues");
    }
}
