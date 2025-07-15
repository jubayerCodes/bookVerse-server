import express, { NextFunction, Request, Response } from "express"
import { Book, bookZodSchema } from "../models/book.model"

export const booksRoutes = express.Router()

// Create Book API
booksRoutes.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = bookZodSchema.parse(req.body)

        const newBook = await Book.create(body)

        res.json({
            success: true,
            message: "Book created successfully",
            data: newBook
        })
    } catch (error: any) {

        if (!error.message) {
            error.message = "Book post failed"
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];

            error.message = `${field} with value '${value}' already exists.`
        }
        next(error)
    }
})

// Get all books API
booksRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { filter, sortBy, sort, limit, page } = req.query

        const limitNum = parseInt(limit as string) || 10;
        const pageNum = parseInt(page as string) || 1;

        const sortOrder = sort === "asc" ? 1 : sort === "desc" ? -1 : undefined;

        const query: any = {};

        if (filter) {
            query.genre = filter;
        }

        let sortOption: any = {};

        let allBooksCursor = Book.find(query)

        if (sortBy && sortOrder !== undefined) {
            sortOption = { [sortBy as string]: sortOrder };
            allBooksCursor = allBooksCursor.sort(sortOption);
        }

        if (!isNaN(pageNum)) {

            const skip = (pageNum - 1) * limitNum
            allBooksCursor = allBooksCursor.skip(skip)
        }

        if (!isNaN(limitNum)) {
            allBooksCursor = allBooksCursor.limit(limitNum);
        }

        const allBooks = await allBooksCursor.exec()

        const total = await Book.countDocuments(query);

        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks,
            meta: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                limit: limitNum
            }
        })
    } catch (error: any) {
        if (!error.message) {
            error.message = "Books retrieve failed"
        }
        next(error)
    }
})


// Get Book By Id
booksRoutes.get('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId

        const book = await Book.findById(bookId)

        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        })
    } catch (error: any) {

        if (!error.message) {
            error.message = "Book retrieve failed"
        }
        next(error)
    }
})


// Update book api
booksRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId
        const updatePart = bookZodSchema.partial().parse(req.body)

        const existingBook = await Book.findById(bookId)

        if (!existingBook) {
            throw new Error("Book not found")
        }

        const updatedBook = await Book.findByIdAndUpdate(bookId, { $set: updatePart }, { new: true })

        res.json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook
        })
    } catch (error: any) {
        if (!error.message) {
            error.message = "Book update failed"
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];

            error.message = `${field} with value '${value}' already exists.`
        }
        next(error)
    }
})

// Delete Book api
booksRoutes.delete("/:bookId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId

        const existingBook = await Book.findById(bookId)

        if (!existingBook) {
            throw new Error("Book not found")
        }

        await existingBook.deleteOne();

        res.json({
            success: true,
            message: "Book deleted successfully",
            data: null
        })
    } catch (error: any) {
        if (!error.message) {
            error.message = "Book delete failed"
        }
        next(error)
    }
})