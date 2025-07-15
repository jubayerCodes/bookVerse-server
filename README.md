# 📚 Book Verse - Smart Library Management

A Library Management REST API built with **Express.js**, **TypeScript**, and **MongoDB (Mongoose)**. This system allows users to manage books and borrowing records, enforcing business rules like inventory control and availability checks.
---

## 💻 Local Setup

    git clone https://github.com/jubayerCodes/bookVerse-server.git
    cd bookVerse-server
    npm install
    npm run dev
---

## ⚙️ Environment Variables

**Create a .env file with:**

    DB_USER=bookVerse
    DB_PASS=UO0WZ9MvraxZmrkZ
---

## 🔗 Live API & Demo

- 🚀 Live API: [https://book-verse-server-alpha.vercel.app](https://book-verse-server-alpha.vercel.app)
- 📁 GitHub Repo: [GitHub Repository](https://github.com/jubayerCodes/bookVerse-server)

---

## 🚀 Features

- 📖 **CRUD Operations** for Books
- 🔄 **Borrow Book** with business logic (copies, availability)
- 📊 **Borrow Summary Report** via Aggregation Pipeline
- 🔍 **Filtering, Sorting, and Limiting** of books
- ✅ **Schema Validation** with Zod
- ⚙️ **Mongoose Middleware** (`pre`, `post`)
- 🧠 **Mongoose Instance Method** for inventory adjustment
- 🛡️ **Robust Error Handling** (Zod, Mongoose, CastError)

---

## 📁 Folder Structure

    src/
    ├── app.ts # Express config
    ├── server.ts # Server entry point
    ├── controllers/ # Books & Borrow routes
    ├── models/ # Mongoose schemas & Zod validation
    ├── interfaces/ # TypeScript interfaces
    └── ...
---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Validation**: Zod + Mongoose Schema
- **Deployment**: Vercel