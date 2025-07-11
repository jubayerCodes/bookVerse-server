import express, { Application, NextFunction, Request, Response } from 'express';
import { booksRoutes } from './app/controllers/books.controller';
import { borrowsRoutes } from './app/controllers/borrows.controller';
const app: Application = express()

app.use(express.json())

app.use("/api/books", booksRoutes)
app.use("/api/borrow", borrowsRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Smart Lib server')
})

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error) {

        let message = error._message

        switch (error.name) {
            case "CastError":
                message = "ObjectId is not valid"
                break;
            case "ZodError":
                message = "Validation failed"
                break;
            default:
                message = error.message
        }

        res.status(400).json(
            {
                success: false,
                message: message || "Something went wrong",
                error
            }
        )
    }
})

export default app