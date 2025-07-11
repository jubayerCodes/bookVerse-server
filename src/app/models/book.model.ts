import { Model, model, Schema } from "mongoose";
import z from "zod";
import { BookInstanceMethods, IBook } from "../interfaces/book.interface";
import { Borrow } from "./borrow.model";

const bookSchema = new Schema<IBook, Model<IBook>, BookInstanceMethods>({
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
})

// Instance Methods
bookSchema.method("adjustInventory", async function adjustInventory(quantity: number) {
    if (quantity > this.copies) {
        throw new Error(`Not enough copies. ${this.copies} copies available.`);
    }

    this.copies -= quantity;

    if (this.copies === 0) {
        this.available = false;
    }

    await this.save()
})

// Pre middleware
bookSchema.pre("findOneAndUpdate", function (next) {
    const update: any = this.getUpdate();

    const copies = update?.copies ?? update?.$set?.copies;

    if (copies !== undefined) {
        if (copies < 0) {
            return next(new Error("Copies must be a positive number"));
        }

        if (copies === 0) {
            if (update?.$set) {
                update.$set.available = false;
            } else {
                update.available = false;
            }
        }

        if (copies > 0) {
            if (update?.$set) {
                update.$set.available = true;
            } else {
                update.available = true;
            }
        }
    }

    next()
})

// Post middleware
bookSchema.post("deleteOne", { document: true, query: false }, async function (doc) {
    if (doc?._id) {
        await Borrow.deleteMany({ book: doc._id });
        console.log(`Deleted all borrow records for book "${doc.title}"`);
    }
});

export const Book = model("Book", bookSchema)

export const bookZodSchema = z.object({
    title: z.string(),
    author: z.string(),
    genre: z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]),
    isbn: z.string(),
    description: z.string().optional(),
    copies: z.number(),
    available: z.boolean()
})