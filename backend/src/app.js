import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import router from "./routes/index.js"; // <— add this

const app = express();

app.use(helmet());                 // security headers
app.use(morgan("dev"));            // request logs
app.use(cors(corsOptions));        // allow your frontend origin + cookies
app.use(express.json());           // parse JSON bodies
app.use(cookieParser());           // read cookies

app.use("/", router);              // <— mount routes (auth + health)

export default app;
