import { Hono } from "hono";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { sign } from "hono/jwt";
import {
  signupInput,
  signinInput,
} from "@jhasatyam/medium-common";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export const userRouter = new Hono<{ Bindings: Bindings }>();


// ==================== SIGNUP ====================

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
    ); //? yaha pe kuch to update hua hai check this again then start react tommorow
  }

  //? use validated data from zod
  const userData = result.data;

  try {
    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
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
    return c.json(
      {
        error: "error while signing up",
        details: e.message,
      },
      403
    );
  }
});


// ==================== SIGNIN ====================

userRouter.post("/signin", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const body = await c.req.json();

  //? validate signin input using zod
  const result = signinInput.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: "Invalid input",
      },
      400
    );
  }

  //? use validated data from zod
  const user = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
  });

  if (!user) {
    return c.json(
      {
        error: "User not found",
      },
      403
    );
  }

  //! agar user milgya to return kardo jwt token
  const jwt = await sign(
    {
      id: user.id,
    },
    c.env.JWT_SECRET
  );

  return c.json({
    jwt,
  });
});