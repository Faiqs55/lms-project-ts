import {app} from "./app"
import connectDB from "./utils/db"
require("dotenv").config();

const port = process.env.PORT;

// Server
app.listen(port, () => {
    console.log(`Server is running on PORT: ${port}`);
    connectDB();
});