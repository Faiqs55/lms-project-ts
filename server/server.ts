import { app } from "./app"
import connectDB from "./utils/db"
require("dotenv").config();
import { v2 as cloudinary } from "cloudinary";

const port = process.env.PORT;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KYE as string,
    api_secret: process.env.CLOUD_API_SECRET as string
})

// Server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
    connectDB();
});