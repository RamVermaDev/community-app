import express from "express";
import mongoose from "mongoose";
import router from "./src/route.mjs";
import { PORT, URL} from "./config.mjs";
import cors from "cors";

mongoose.connect(URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(error);
});

const app = express();
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors({
    exposedHeaders: ['authorization']
}));

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});