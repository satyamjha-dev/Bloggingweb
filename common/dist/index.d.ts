import { z } from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const createPostInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export declare const updatePostInput: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
}, z.core.$strip>;
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;
