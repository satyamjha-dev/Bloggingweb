Step 1 - Initialize the backend
Whenever you’re building a project, usually the first thing you should do is initialise the project’s backend.
Create a new folder called medium
mkdir medium
cd medium

Initialize a hono based cloudflare worker app 
npm create hono@latest

Target directory › backend
Which template do you want to use? - cloudflare-workers
Do you want to install project dependencies? … yes
Which package manager do you want to use? › npm (or yarn or bun, doesnt matter)

Step 2 - Initialize handlers

To begin with, our backend will have 4 routes
POST /api/v1/user/signup
POST /api/v1/user/signin
POST /api/v1/blog
PUT /api/v1/blog
GET /api/v1/blog/:id
GET /api/v1/blog/bulk

Step-3 Initialize DB (Prisma)
 Initialize prisma in your project
Make sure you are in the backend folder
npm i prisma
npx prisma init

 
1. Install Prisma Dependencies
Install Prisma Client and the Neon adapter:
npm install @prisma/client @prisma/adapter-neon

Make sure Prisma CLI and dotenv are installed:
npm install -D prisma dotenv

2. Initialize Prisma
If Prisma is not initialized yet:
npx prisma init

This creates:
prisma/
└── schema.prisma

prisma.config.ts
.env

3. Configure prisma.config.ts
Use env() from Prisma instead of process.env:
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});

4. Add Neon Database URL
In .env:
DATABASE_URL="your-neon-pooled-connection-string"

Use the pooled Neon connection string (-pooler hostname).
Example:
DATABASE_URL="postgresql://username:password@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"

5. Configure schema.prisma
Open:
prisma/schema.prisma

Use:
generator client {
  provider = "prisma-client"
  runtime  = "cloudflare"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}

Important
For Cloudflare Workers:
runtime = "cloudflare"

And generated Prisma Client will be created here:
src/generated/prisma

6. Create Database Migration
Run:
npx prisma migrate dev --name init

This will:
1. Connect to Neon
2. Create the database tables
3. Create a migration
4. Keep Prisma's migration history updated
You should get:
prisma/
├── migrations/
│   └── ...
└── schema.prisma

7. Generate Prisma Client
Run:
npx prisma generate

This generates the Prisma Client inside:
src/generated/prisma

8. Validate Prisma Setup
Run:
npx prisma validate

If everything is correct, Prisma should report that the schema is valid.
9. Current Project Structure
At this point your project should roughly look like:
backend/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── generated/
│   │   └── prisma/
│   └── index.ts
│
├── .env
├── prisma.config.ts
├── wrangler.jsonc
├── package.json
└── tsconfig.json

10. Wrangler Configuration
Your current wrangler.jsonc is fine:
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "backend",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-29"
}

No changes are required here at this stage.
11. Next Step
After Prisma migration and generation are successful, connect Prisma to Hono using:
Hono
  ↓
PrismaClient
  ↓
PrismaNeon
  ↓
DATABASE_URL
  ↓
Neon PostgreSQL

The next file to configure will be:
src/index.ts

with PrismaClient + PrismaNeon.

IN HINGLISH THE SAME STEPS TO SETUP PRISMA IN THE FOLDER 
- Backend folder bana liya
- Hono + Cloudflare Worker setup kar liya
- Prisma 7 initialize kar liya
- Neon DB bana liya
- Neon ka pooled (-pooler) connection string .env mein daal diya
Ab yahan se ye steps follow karo.
1. Required packages install karo
Project ke backend folder mein:
npm install @prisma/client @prisma/adapter-neon

Prisma 7 + Neon + Cloudflare ke liye Prisma ka official setup @prisma/adapter-neon use karta hai. Prisma
2. prisma.config.ts check karo
prisma init ne normally ye bana diya hoga:
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: env("DATABASE_URL"),
  },
});

Aur .env:
DATABASE_URL="your-neon-pooled-connection-string"

Prisma 7 mein database URL prisma.config.ts ke datasource.url se configure hota hai. Prisma
3. schema.prisma configure karo
Open:
prisma/schema.prisma

Cloudflare Worker ke liye:
generator client {
  provider = "prisma-client"
  runtime  = "cloudflare"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

Ab apna model add karo. Example:
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}

runtime = "cloudflare" important hai because Prisma Client ko Worker runtime ke liye generate karna hai. Prisma ki v7 Cloudflare guide bhi isi configuration ko use karti hai. Prisma
4. Database mein tables create karo
Agar new project hai aur schema ko Neon DB mein push/migrate karna hai:
npx prisma migrate dev --name init

Ye:
schema.prisma
      ↓
migration
      ↓
Neon PostgreSQL
      ↓
tables

create karega.
Agar tum migrations nahi use karna chahte aur simply schema DB mein push karna hai:
npx prisma db push

Recommended: proper project ke liye migrate dev use karo.
5. Prisma Client generate karo
npx prisma generate

Isse:
src/
└── generated/
    └── prisma/
        └── client.ts

type generated client milega. Prisma 7 ka generate command schema ke generator/output ke basis par client generate karta hai. Prisma
6. Cloudflare compatibility check
Tum Cloudflare Worker use kar rahe ho.
wrangler.jsonc mein ideally:
{
  "name": "your-project",
  "main": "src/index.ts",
  "compatibility_date": "2026-09-29",
  "compatibility_flags": ["nodejs_compat"]
}

Lekin: Neon ke @prisma/adapter-neon setup mein exact Cloudflare configuration tumhare current Prisma/adapter version ke according follow karni chahiye. Prisma's current v7 Cloudflare docs specifically Neon ko edge-compatible driver ke roop mein document karti hain. Prisma
7. Ab src/index.ts mein connection banao
import { Hono } from "hono";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

type Bindings = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const result = await prisma.$queryRaw`SELECT 1`;

  return c.json({
    message: "Database connected!",
    result,
  });
});

export default app;

Official Prisma v7 Cloudflare + Neon example bhi PrismaNeon, PrismaClient aur env.DATABASE_URL ka yehi basic pattern use karta hai. Prisma
8. Local environment mein DATABASE_URL
Tumne already .env mein daal diya hai:
DATABASE_URL="postgresql://.....-pooler....."

Good.
Important: .env ko GitHub par push mat karna.
9. Local Worker run karo
npm run dev

ya:
npx wrangler dev

Browser mein:
http://localhost:8787/

Expected:
{
  "message": "Database connected!",
  "result": [...]
}

Agar ye aa gaya:
Worker
 ↓
Hono
 ↓
Prisma 7
 ↓
PrismaNeon
 ↓
Neon
 ↓
PostgreSQL

connection working hai. ✅
10. Production ke liye DATABASE_URL secret
Ye step bahut important hai.
.env production Worker ko automatically nahi milta.
Run:
npx wrangler secret put DATABASE_URL

Prompt aayega:
Enter a secret value:

Usmein same Neon pooled connection string paste karo.
Prisma's Cloudflare deployment docs also instruct setting DATABASE_URL as a Wrangler secret before deployment. Prisma
11. Deploy
npm run deploy

or:
npx wrangler deploy

Then:
https://your-worker.your-subdomain.workers.dev/

open karo.
12. Uske baad actual API banao
Connection test successful hone ke baad SELECT 1 ko hata ke actual Prisma query:
app.get("/users", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const users = await prisma.user.findMany();

  return c.json(users);
});

Then:
GET /users

Haan bhai, prisma generate ka simple matlab hai: tumhare schema.prisma ko padhkar Prisma tumhare liye Prisma Client ka code generate karta hai.
Simple flow
Tumne schema mein likha:
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  name     String?
  password String
  posts    Post[]
}

Ab Prisma ko ye information chahiye taaki TypeScript mein pata ho:
prisma.user.create()
prisma.user.findMany()
prisma.user.findUnique()

Aur User ke andar kaunse fields hain:
id
email
name
password
posts

Ye information automatically generated client mein convert hoti hai.
npx prisma generate kya karta hai?
npx prisma generate

Conceptually:
schema.prisma
      ↓
 Prisma Generate
      ↓
Generated Prisma Client
      ↓
src/generated/prisma/

Tumhare setup mein:
output = "../src/generated/prisma"

isliye generated code yahan aata hai:
src/
└── generated/
    └── prisma/

Aur tum phir us generated client ko import karte ho:
import { PrismaClient } from "./generated/prisma/client";

Tumhare current error se relation
Tumhare schema mein:
password String

hai.
Agar generated Prisma Client old hai aur usmein password nahi hai, TypeScript kahega:
'password' does not exist...

Isliye:
npx prisma generate

karne se Prisma current schema ko dobara read karke updated client generate karta hai.
Ek line mein yaad rakho:
schema.prisma = tum kya database structure chahte ho
prisma generate = us structure ke according Prisma Client ka code banana

Aur generate database mein table create/update nahi karta. Database structure change karne ke liye prisma migrate / prisma db push use hota hai.
JWT Setup in Hono — Signup Route
1. Import JWT
import { sign } from "hono/jwt";

sign() ka use JWT token create/generate karne ke liye hota hai.
2. JWT Secret
.env mein:
JWT_SECRET="my-super-secret-key"

Ye secret JWT ko sign karne ke liye use hota hai.
Production mein Cloudflare secret:
npx wrangler secret put JWT_SECRET

3. Add JWT Secret to Bindings
type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

Ab Hono Worker ko pata hai ki environment mein dono values available hain:
DATABASE_URL
JWT_SECRET

4. Signup Route
app.post("/api/v1/signup", async (c) => {
  const adapter = new PrismaNeon({
    connectionString: c.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  const body = await c.req.json();

  try {
    const user = await prisma.user.create({ //ye prisma client ka kam hai 
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const token = await sign(
      {
        id: user.id,
      },
      c.env.JWT_SECRET
    );

    return c.json({
      message: "Signup successful",
      token,
    });

  } catch (e) {
    return c.status(403);
  }
});

5. JWT Generation Flow
User signup request bhejta hai:
{
  "email": "satyam@gmail.com",
  "password": "123456"
}

Flow:
POST /api/v1/signup
        ↓
   Request Body
        ↓
   PrismaNeon
        ↓
   PrismaClient
        ↓
   User created
        ↓
     user.id
        ↓
      sign()
        ↓
   JWT Token
        ↓
    Response

6. sign() kaise kaam karta hai?
const token = await sign(
  {
    id: user.id,
  },
  c.env.JWT_SECRET
);

Yahan do important cheezein hain:
Payload
{
  id: user.id
}

Ye JWT ke andar information hai.
Example:
{
  "id": "abc-123"
}

Secret
c.env.JWT_SECRET

Ye JWT ko sign karne ke liye secret key hai.
So:
Payload
   +
JWT_SECRET
   ↓
sign()
   ↓
JWT Token

7. Response
Generated token client ko bhej dete hain:
return c.json({
  message: "Signup successful",
  token,
});

Response:
{
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

Client future protected requests mein is token ko use karega.
8. sign, verify, decode
Hono JWT mein generally teen important functions milte hain:
Function	Purpose
sign()	JWT create karta hai
verify()	JWT genuine/valid hai ya nahi check karta hai
decode()	JWT ka payload read/decode karta hai


Abhi signup mein:
sign()

ki zarurat hai.
Baad mein protected route mein:
verify()

use karenge.
9. Complete Authentication Flow
SIGNUP
  ↓
User create
  ↓
JWT generate
  ↓
Client gets JWT

Then later:
LOGIN
  ↓
Credentials check
  ↓
JWT generate
  ↓
Client gets JWT

Then protected API:
Client
  ↓
JWT भेजता है
  ↓
verify()
  ↓
Valid?
 ├── YES → API access
 └── NO  → 401/403

Important
Abhi learning setup mein:
password: body.password

plain password store kar raha hai. Real application mein password ko hash karke store karna chahiye (e.g. bcrypt/Argon2).
Also, JWT secret ko source code mein hardcode mat karo:
// ❌
sign(payload, "my-secret")

Environment/Cloudflare secret use karo:
// ✅
sign(payload, c.env.JWT_SECRET)

One-line memory trick
sign() = JWT banana
verify() = JWT check karna
decode() = JWT ke andar ka data read karna
Backend Progress — 03 Oct 2026
1. Shared Validation Package
Created a separate shared package for request validation:
common/
├── src/
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json

Package name:
@jhasatyam/medium-common

Zod Schemas
Added validation schemas for:
- Signup
- Signin
- Create Post
- Update Post
export const signupInput = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signinInput = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const createPostInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const updatePostInput = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
});

Type Inference
Used z.infer to generate TypeScript types directly from schemas:
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;

2. Published Shared Package to NPM
Published the package publicly on npm.
Final published version:
@jhasatyam/medium-common@1.0.1

Package can now be installed using:
npm install @jhasatyam/medium-common@1.0.1

3. Backend Integration
Backend now uses the shared npm package instead of defining validation schemas inside the backend.
User Routes
Imported:
import {
  signupInput,
  signinInput,
} from "@jhasatyam/medium-common";

Blog Routes
Imported:
import {
  createPostInput,
  updatePostInput,
} from "@jhasatyam/medium-common";

4. Signup Validation
Signup request is validated before creating the user:
const result = signupInput.safeParse(body);

if (!result.success) {
  return c.json(
    {
      error: "Invalid input",
    },
    400
  );
}

Validated data is then used:
result.data.email
result.data.password

5. Signin Validation
Signin now uses the signin schema, rather than accidentally using the signup schema:
const result = signinInput.safeParse(body);

if (!result.success) {
  return c.json(
    {
      error: "Invalid input",
    },
    400
  );
}

6. Create Blog Validation
Create-blog requests are validated using:
createPostInput.safeParse(body);

Validated values are used for Prisma:
title: result.data.title,
content: result.data.content,

7. Update Blog Validation
Update-blog requests are validated using:
updatePostInput.safeParse(body);

Validated values are used:
id: result.data.id,
title: result.data.title,
content: result.data.content,

8. JWT Authentication
Blog routes are protected using JWT middleware.
Authorization header:
Authorization: Bearer <token>

Token is verified using:
verify(
  authheader,
  c.env.JWT_SECRET,
  "HS256"
);

The user's ID is stored in Hono context:
c.set("userId", response.id);

Routes can then access it using:
const userId = c.get("userId");

9. Current Blog APIs
Create Blog
POST /api/v1/blog

Protected by JWT.
Update Blog
PUT /api/v1/blog

Protected by JWT.
Get All Blogs
GET /api/v1/blog/bulk

Get Single Blog
GET /api/v1/blog/:id

10. Current Architecture
                    ┌─────────────────────┐
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Hono API      │
                    │     Cloudflare      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
      ┌─────────────────┐              ┌─────────────────┐
      │  Zod Validation │              │ JWT Middleware  │
      │ medium-common   │              │ Authentication  │
      └────────┬────────┘              └────────┬────────┘
               │                                │
               └──────────────┬─────────────────┘
                              ▼
                    ┌─────────────────────┐
                    │       Prisma        │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │        Neon         │
                    └─────────────────────┘

Today's Major Milestone
✅ Shared Zod package created
✅ Zod schemas created
✅ z.infer types created
✅ Package tested locally
✅ Package published to npm
✅ @jhasatyam/medium-common@1.0.1 published
✅ Backend connected to shared package
✅ Signup validation
✅ Signin validation
✅ Create blog validation
✅ Update blog validation
✅ JWT authentication middleware

Next
Frontend (React)
       ↓
Connect APIs
       ↓
Test complete application
       ↓
Cloudflare deployment
       ↓
Production testing