import { z } from "zod";

//! Signup validation
export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

//! Signin validation
export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

//! Create blog validation
export const createPostInput = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

//! Update blog validation
export const updatePostInput = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;