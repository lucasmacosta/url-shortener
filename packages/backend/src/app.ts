import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import "express-async-errors";

import redirect from "./routes/redirect";
import urls from "./routes/urls";
import errorHandler from "./middlewares/error-handler";

export const app = express();

// middleware for json body parsing
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/urls", urls);
app.use("/", redirect);

app.use(errorHandler);

export default app;
