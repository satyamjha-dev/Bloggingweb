import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { sign,verify } from "hono/jwt";
// import { poweredBy } from 'hono/powered-by'
// import { logger } from 'hono/logger'
// import { basicAuth } from 'hono/basic-auth'

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();//! bindings to start app() if we remove this typescript errors can occur
app.use('/api/v1/blog/*', async (c, next) => {
  //?get headder
  //?verify the header 
  //?if header is valid then call next() else return error
  const header = c.req.header("Authorization");
  const response = await verify(header || "", c.env.JWT_SECRET, "HS256");//! you can get some issues with typscript
  if (response.id) {
    await next();
  }else{
    return c.json({ error: "Unauthorized" }, 401);
  }

  
})//! middleware for blog routes

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


app.post('/api/v1/user/signin', async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({
    adapter,
  });
  const body = await  c.req.json();
  const  user = await prisma.user.findUnique({
    where: {
      email: body.email

    }
  });
  if (!user) {
  return c.json({ error: "User not found" }, 403);
}
    //!agar user milgya to return kardo jwt token;
  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET); //! bhai db mujhe jwt deded return karna hai 
  return c.json({jwt},{Done: "request jaa raha hai bhai "});

})
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
