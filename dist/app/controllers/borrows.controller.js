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
exports.borrowsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
exports.borrowsRoutes = express_1.default.Router();
exports.borrowsRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = borrow_model_1.borrowZodSchema.parse(req.body);
        const { book, quantity, dueDate } = body;
        const existingBook = yield book_model_1.Book.findById(book);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        yield existingBook.adjustInventory(quantity);
        const newBorrow = yield borrow_model_1.Borrow.create(body);
        res.json({
            success: true,
            message: "Book borrowed successfully",
            data: newBorrow
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book borrow failed";
        }
        next(error);
    }
}));
exports.borrowsRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const limit = parseInt(req.query.limit) || 5;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        // Full aggregation pipeline with pagination
        const aggregationPipeline = [
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $sort: {
                    "bookDetails.title": 1
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn"
                    },
                    totalQuantity: 1
                }
            }
        ];
        // Clone pipeline for counting (without pagination)
        const countPipeline = [...aggregationPipeline, { $count: "total" }];
        const countResult = yield borrow_model_1.Borrow.aggregate(countPipeline);
        const total = ((_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        const pages = Math.ceil(total / limit);
        // Add pagination to main pipeline
        aggregationPipeline.push({ $skip: skip }, { $limit: limit });
        const bookSummary = yield borrow_model_1.Borrow.aggregate(aggregationPipeline);
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            meta: {
                total,
                limit,
                page,
                pages
            },
            data: bookSummary
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Borrowed books summary retrieve failed";
        }
        next(error);
    }
}));
