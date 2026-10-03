import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { sign } from "hono/jwt";
import { signupInput } from "@jhasatyam/medium-common";
import { signinInput } from "@jhasatyam/medium-common";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export const userRouter = new Hono<{ Bindings: Bindings }>();


userRouter.post("/signup", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({
    adapter,
  });
  const body = await c.req.json();
  const result = signupInput.safeParse(body);

if (!result.success) {
  return c.json(
    {
      error: "Invalid input",
    },
    400
  );
}
  //sanatize the input 
  try {
    // Create user in database
    const user = await prisma.user.create({
  data: {
    email: result.data.email,
    password: result.data.password,
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


userRouter.post('/signin', async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({
    adapter,
  });
 const body = await c.req.json();

 const { success } = signinInput.safeParse(body); //? validate the input using zod

if (!success) {
  return c.json(
    {
      error: "Invalid input",
    },
    400
  );
}
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
