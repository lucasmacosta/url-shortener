import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "express-async-errors";

import redirect from "./routes/redirect";
import urls from "./routes/urls";
import users from "./routes/users";
import errorHandler from "./middlewares/error-handler";

export const app = express();

// middleware for json body parsing
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cors());

app.use("/urls", urls);
app.use("/users", users);
app.use("/", redirect);

app.use(errorHandler);

export default app;
