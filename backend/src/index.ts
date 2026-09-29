import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { sign } from "hono/jwt";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.text("WORKER OK");
});

app.post("/api/v1/signup", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const body = await c.req.json();

  try {
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    // Generate JWT
    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    // Send JWT to client
    return c.json({
      message: "Signup successful",
      token,
    });

  } catch (e: any) {
    return c.json({ error: "error while signing up", details: e.message }, 403);
  }
});


// app.post('/api/v1/user/signin', (c) => {
//   return c.text('singin')
// })
// app.post('/api/v1/blog', (c) => {
//   return c.text('blog')
// })
// app.put('/api/v1/blog', (c) => {
//   return c.text('blog')
// })
// app.get('/api/v1/blog/:id', (c) => {
//   return c.text('id!')
// })
// app.get('/api/v1/blog/bulk', (c) => {
//   return c.text('bulk!')
// })


export default app
