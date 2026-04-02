"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Contact_controller_1 = require("./Contact.controller");
const router = express_1.default.Router();
router.post('/', Contact_controller_1.ContactController.createContactController);
exports.ContactRoutes = router;
