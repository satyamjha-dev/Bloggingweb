# JWT Authentication Flow (Hinglish)

## JWT kya hota hai?

JWT ka full form **JSON Web Token** hai. Yeh ek signed token hota hai jo backend user ki identity ko securely represent karne ke liye banata hai.

Is project mein signup ke baad JWT generate hota hai. Client is token ko future protected API requests ke saath bhej sakta hai. Backend token verify karke identify kar sakta hai ki request kis user ki hai.

> JWT password ko store nahi karta. Is project ke token payload mein sirf user ka `id` hai.

## Is project mein JWT ke required parts

### 1. Hono JWT import

`backend/src/index.ts` mein Hono ka JWT helper import hai:

```ts
import { sign } from "hono/jwt";
```

`sign()` token ko create aur cryptographically sign karta hai.

### 2. `JWT_SECRET`

`JWT_SECRET` ek private random secret key hai. Backend isi key se token sign karta hai.

Local development ke liye yeh `backend/.env` mein hona chahiye:

```env
JWT_SECRET="your-long-random-private-secret"
```

Cloudflare production Worker ke liye same name ka secret add kiya gaya hai:

```bash
cd backend
npx wrangler secret put JWT_SECRET
```

Cloudflare Worker mein is secret ko `c.env.JWT_SECRET` se access kiya jata hai.

```ts
type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
```

## Signup par JWT ka complete flow

Route:

```text
POST /api/v1/signup
```

Request body example:

```json
{
  "email": "test@example.com",
  "password": "test-password"
}
```

Flow step by step:

1. Client `POST /api/v1/signup` request bhejta hai.
2. Hono request ka JSON body read karta hai:

   ```ts
   const body = await c.req.json();
   ```

3. Prisma user ko Neon database mein create karta hai:

   ```ts
   const user = await prisma.user.create({
     data: {
       email: body.email,
       password: body.password,
     },
   });
   ```

4. Database se created user milta hai, including `user.id`.
5. Hono us user ID aur private secret se token generate karta hai:

   ```ts
   const token = await sign(
     { id: user.id },
     c.env.JWT_SECRET
   );
   ```

6. `await` important hai kyunki `sign()` asynchronous function hai. Yeh complete token banne tak wait karta hai.
7. Backend successful JSON response return karta hai:

   ```ts
   return c.json({
     message: "Signup successful",
     token,
   });
   ```

## Token ke andar kya hota hai?

Generated JWT normally teen dot-separated parts mein hota hai:

```text
header.payload.signature
```

- **Header**: signing algorithm ki information. Hono ka default yahan `HS256` hai.
- **Payload**: application data. Yahan `{ id: user.id }` hota hai.
- **Signature**: payload aur secret se generate hoti hai. Isi se token tampering detect hoti hai.

Token ko decode kiya ja sakta hai, isliye uske payload mein password, `JWT_SECRET`, ya sensitive data kabhi mat rakho.

## Token future requests mein kaise use hoga?

Client signup response se `token` save karega. Protected route call karte waqt HTTP `Authorization` header mein bhejega:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Future middleware same `JWT_SECRET` se token verify karega. Agar signature valid hui, backend payload se `id` nikaal kar current user identify kar sakta hai.

## Terminal se local test

Terminal 1 mein Worker start karo:

```bash
cd backend
npm run dev
```

Terminal 2 mein request bhejo:

```bash
curl -i -X POST http://localhost:8787/api/v1/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"test-password\"}"
```

Expected response:

```json
{
  "message": "Signup successful",
  "token": "eyJ..."
}
```

Timestamp har request ke liye unique email banata hai, isliye duplicate-email database error nahi aayega.

## Important security rules

1. `JWT_SECRET` ko private rakho. Frontend code, GitHub, screenshots, ya API response mein kabhi mat dalo.
2. `backend/.env` ko Git mein commit mat karo.
3. Local `.env` aur deployed Cloudflare Worker dono mein `JWT_SECRET` configured hona chahiye.
4. Production mein long random secret use karo. Secret change karne par purane tokens invalid ho jayenge.
5. Current code plaintext password store karta hai. Real production app mein password ko hash (for example bcrypt/Argon2) karke store karna chahiye.

## Quick troubleshooting

| Problem | Meaning | Fix |
| --- | --- | --- |
| JWT generate nahi ho raha | `JWT_SECRET` missing ho sakta hai | Local `.env` aur Cloudflare Worker secret check karo |
| `403 error while signing up` | Database ya JWT signing mein error aaya | Worker logs aur error `details` check karo |
| `404 Not Found` | Wrong URL/method use ho raha hai | `POST /api/v1/signup` use karo |
| Unique constraint error | Same email already database mein hai | New unique email use karo |

## Current final signup flow

```text
POST /api/v1/signup
        |
        v
Request body read hoti hai
        |
        v
Prisma user ko Neon mein create karta hai
        |
        v
user.id milti hai
        |
        v
sign({ id: user.id }, c.env.JWT_SECRET)
        |
        v
{ "message": "Signup successful", "token": "..." }
```
