"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookZodSchema = exports.Book = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = __importDefault(require("zod"));
const borrow_model_1 = require("./borrow.model");
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
// Instance Methods
bookSchema.method("adjustInventory", function adjustInventory(quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        if (quantity > this.copies) {
            throw new Error(`Not enough copies. ${this.copies} copies available.`);
        }
        this.copies -= quantity;
        if (this.copies === 0) {
            this.available = false;
        }
        yield this.save();
    });
});
// Pre middleware
bookSchema.pre("findOneAndUpdate", function (next) {
    var _a, _b;
    const update = this.getUpdate();
    const copies = (_a = update === null || update === void 0 ? void 0 : update.copies) !== null && _a !== void 0 ? _a : (_b = update === null || update === void 0 ? void 0 : update.$set) === null || _b === void 0 ? void 0 : _b.copies;
    if (copies !== undefined) {
        if (copies < 0) {
            return next(new Error("Copies must be a positive number"));
        }
        if (copies === 0) {
            if (update === null || update === void 0 ? void 0 : update.$set) {
                update.$set.available = false;
            }
            else {
                update.available = false;
            }
        }
        if (copies > 0) {
            if (update === null || update === void 0 ? void 0 : update.$set) {
                update.$set.available = true;
            }
            else {
                update.available = true;
            }
        }
    }
    next();
});
// Post middleware
bookSchema.post("deleteOne", { document: true, query: false }, function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc === null || doc === void 0 ? void 0 : doc._id) {
            yield borrow_model_1.Borrow.deleteMany({ book: doc._id });
            console.log(`Deleted all borrow records for book "${doc.title}"`);
        }
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
exports.bookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number(),
    available: zod_1.default.boolean()
});
