import { app } from "./app"
import { initSocketServer } from "./socketServer";
import connectDB from "./utils/db"
require("dotenv").config();
import { v2 as cloudinary } from "cloudinary";
import http from "http"
const port = process.env.PORT;

const server = http.createServer(app)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KYE as string,
    api_secret: process.env.CLOUD_API_SECRET as string
});
initSocketServer(server);

// Server
server.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
    connectDB();
});