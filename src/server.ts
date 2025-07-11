import app from "./app";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const port = 3000

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.opkciwj.mongodb.net/SmartLibDB?retryWrites=true&w=majority&appName=Cluster0`);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}