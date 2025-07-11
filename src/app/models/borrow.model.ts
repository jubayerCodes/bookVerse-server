
import z from "zod";
import { IBorrow } from "../interfaces/borrow.interface";
import { model, Schema } from "mongoose";

const borrowSchema = new Schema<IBorrow>({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    dueDate: { type: Date, required: true }
}, {
    timestamps: true,
    versionKey: false
})

export const Borrow = model<IBorrow>("Borrow", borrowSchema)

export const borrowZodSchema = z.object({
    book: z.string(),
    quantity: z.number(),
    dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format"
    })
})