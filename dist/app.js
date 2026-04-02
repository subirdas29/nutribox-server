"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_1 = __importDefault(require("xss"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use((req, res, next) => {
    if (req.body) {
        req.body = (0, xss_1.default)(req.body);
    }
    if (req.query) {
        for (const key of Object.keys(req.query)) {
            const value = req.query[key];
            if (typeof value === 'string') {
                req.query[key] = (0, xss_1.default)(value);
            }
        }
    }
    next();
});
app.use((0, cors_1.default)({
    origin: config_1.default.NODE_ENV === 'production'
        ? process.env.CLIENT_URL || 'https://nutribox-client.vercel.app'
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
        ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send({
        status: true,
        message: 'Server Live',
    });
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
