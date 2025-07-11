"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrows_controller_1 = require("./app/controllers/borrows.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", books_controller_1.booksRoutes);
app.use("/api/borrow", borrows_controller_1.borrowsRoutes);
app.get('/', (req, res) => {
    res.send('Smart Lib server');
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
app.use((error, req, res, next) => {
    if (error) {
        let message = error._message;
        switch (error.name) {
            case "CastError":
                message = "ObjectId is not valid";
                break;
            case "ZodError":
                message = "Validation failed";
                break;
            default:
                message = error.message;
        }
        res.status(400).json({
            success: false,
            message: message || "Something went wrong",
            error
        });
    }
});
exports.default = app;
