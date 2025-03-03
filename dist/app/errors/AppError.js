"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message, stack) {
        // stack error ta by default expressJS amder diya  dae. stack e error kotheke hyse, ki karone hyse kon route theke hyse ta dae,eta debug khtre onk help kre
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
