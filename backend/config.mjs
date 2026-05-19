import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const URL = process.env.URL;
const secret_key = process.env.secret_key;

export { PORT, URL, secret_key };
