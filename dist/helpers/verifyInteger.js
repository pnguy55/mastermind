"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = verifyInteger;
function verifyInteger(value, property) {
  if (isNaN(value)) {
    throw new Error(`${property}: [${value}] is not a number and thus invalid.`);
  }
}
//# sourceMappingURL=verifyInteger.js.map