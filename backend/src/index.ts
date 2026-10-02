import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { sign,verify } from "hono/jwt";
import { blogRouter } from "./routes/blog";
import { userRouter } from "./routes/user";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();//! bindings to start app() if we remove this typescript errors can occur

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);



export default app
