"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookZodSchema = exports.Book = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: { type: String, required: true, enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"] },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true, min: [0, "Copies must be a positive number"] },
    available: { type: Boolean, required: true, default: true }
}, {
    versionKey: false,
    timestamps: true
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
exports.bookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.string(),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number(),
    available: zod_1.default.boolean()
});
