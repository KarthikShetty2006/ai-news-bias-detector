import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
const PORT = process.env.PORT || 5000;
console.log(process.env.NEWS_API_URL);
connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});