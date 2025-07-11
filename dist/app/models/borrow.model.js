"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowZodSchema = exports.Borrow = void 0;
const zod_1 = __importDefault(require("zod"));
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    dueDate: { type: Date, required: true }
}, {
    timestamps: true,
    versionKey: false
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
exports.borrowZodSchema = zod_1.default.object({
    book: zod_1.default.string(),
    quantity: zod_1.default.number(),
    dueDate: zod_1.default.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
    })
});
