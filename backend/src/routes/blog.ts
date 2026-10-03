import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import {
  createPostInput,
  updatePostInput,
} from "@jhasatyam/medium-common";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

type variables = {
  userId: string;
};//! variables for the blog routes

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: variables;
}>();

blogRouter.use("/*", async (c, next) => {
  //? split the header and get the token from it format [bearer token]
  const authheader = c.req.header("Authorization")?.split(" ")[1];
  //! ye header se token nikal raha hai

  //? check if authorization header exists
  if (!authheader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    //? verify the token using JWT secret
    const response = (await verify(
      authheader,
      c.env.JWT_SECRET,
      "HS256"
    )) as {
      id?: string;
    };

    //? check if token contains user id
    if (response.id) {
      c.set("userId", response.id);
      //! set the id in the context so that we can use it in the next middleware

      await next();
    } else {
      return c.json({ error: "Unauthorized" }, 401);
    }
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
});
//! middleware for blog routes


// ==================== CREATE BLOG ====================

blogRouter.post("/", async (c) => {
  const userId = c.get("userId");

  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const body = await c.req.json();

  const result = createPostInput.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: "Invalid input",
      },
      400
    );
  }

  const post = await prisma.post.create({
    data: {
      title: result.data.title,
      content: result.data.content,
      authorId: userId,
    },
  });

  return c.json({
    id: post.id,
  });
});


// ==================== UPDATE BLOG ====================

blogRouter.put("/", async (c) => {
  const userId = c.get("userId");

  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const body = await c.req.json();

  const result = updatePostInput.safeParse(body);

  if (!result.success) {
    return c.json(
      {
        error: "Invalid input",
      },
      400
    );
  }

  //? first find the post
  const post = await prisma.post.findUnique({
    where: {
      id: result.data.id,
    },
  });

  //? check if post exists
  if (!post) {
    return c.json(
      {
        error: "Post not found",
      },
      404
    );
  }

  //? update the post
  await prisma.post.update({
    where: {
      id: result.data.id,
    },
    data: {
      title: result.data.title,
      content: result.data.content,
    },
  });

  return c.json({
    message: "updated post",
  });
});

// todo: pagination

blogRouter.get("/bulk", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const posts = await prisma.post.findMany({});

  return c.json(posts);
});

// ==================== GET SINGLE BLOG ====================

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    return c.json(
      {
        error: "Post not found",
      },
      404
    );
  }

  return c.json(post);
});