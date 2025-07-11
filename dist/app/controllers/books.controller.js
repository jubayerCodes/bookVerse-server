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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
exports.booksRoutes = express_1.default.Router();
// Create Book API
exports.booksRoutes.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = book_model_1.bookZodSchema.parse(req.body);
        const newBook = yield book_model_1.Book.create(body);
        res.json({
            success: true,
            message: "Book created successfully",
            data: newBook
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book post failed";
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            error.message = `${field} with value '${value}' already exists.`;
        }
        next(error);
    }
}));
// Get all books API
exports.booksRoutes.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit = 10 } = req.query;
        const sortOrder = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        let sortOption = {};
        let allBooksCursor = book_model_1.Book.find(query);
        if (sortBy && sortOrder !== undefined) {
            sortOption = { [sortBy]: sortOrder };
            allBooksCursor = allBooksCursor.sort(sortOption);
        }
        if (limit && !isNaN(Number(limit))) {
            allBooksCursor = allBooksCursor.limit(Number(limit));
        }
        const allBooks = yield allBooksCursor.exec();
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Books retrieve failed";
        }
        next(error);
    }
}));
// Get Book By Id
exports.booksRoutes.get('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield book_model_1.Book.findById(bookId);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book retrieve failed";
        }
        next(error);
    }
}));
// Update book api
exports.booksRoutes.put('/:bookId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatePart = book_model_1.bookZodSchema.partial().parse(req.body);
        const existingBook = yield book_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(bookId, { $set: updatePart }, { new: true });
        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book update failed";
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            error.message = `${field} with value '${value}' already exists.`;
        }
        next(error);
    }
}));
// Delete Book api
exports.booksRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const existingBook = yield book_model_1.Book.findById(bookId);
        if (!existingBook) {
            throw new Error("Book not found");
        }
        yield existingBook.deleteOne();
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null
        });
    }
    catch (error) {
        if (!error.message) {
            error.message = "Book delete failed";
        }
        next(error);
    }
}));
