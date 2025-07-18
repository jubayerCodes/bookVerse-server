import express, { NextFunction, Request, Response } from "express"
import { Borrow, borrowZodSchema } from "../models/borrow.model"
import { Book } from "../models/book.model"

export const borrowsRoutes = express.Router()

borrowsRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = borrowZodSchema.parse(req.body)

        const { book, quantity, dueDate } = body

        const existingBook = await Book.findById(book)

        if (!existingBook) {
            throw new Error("Book not found")
        }

        await existingBook.adjustInventory(quantity)

        const newBorrow = await Borrow.create(body)

        res.json({
            success: true,
            message: "Book borrowed successfully",
            data: newBorrow
        })
    } catch (error: any) {
        if (!error.message) {
            error.message = "Book borrow failed"
        }
        next(error)
    }
})

borrowsRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        // Full aggregation pipeline with pagination
        const aggregationPipeline: any[] = [
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
        const countResult = await Borrow.aggregate(countPipeline);
        const total = countResult[0]?.total || 0;
        const pages = Math.ceil(total / limit);

        // Add pagination to main pipeline
        aggregationPipeline.push({ $skip: skip }, { $limit: limit });

        const bookSummary = await Borrow.aggregate(aggregationPipeline);

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
    } catch (error: any) {
        if (!error.message) {
            error.message = "Borrowed books summary retrieve failed"
        }
        next(error)
    }
})