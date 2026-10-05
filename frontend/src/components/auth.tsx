import { Link ,useNavigate} from "react-router-dom";
import {
  signupInput,
  signinInput,
} from "@jhasatyam/medium-common";
import { useState } from "react";
import axios from "axios";
// 1. Reusable Input Component
interface LabeledInputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  
  // noidea of this line
}

function LabeledInput({ label, placeholder, type = "text", onChange }: LabeledInputProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-sm font-medium text-black text-left">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
      />
    </div>
  );
}

// 2. Main Reusable AuthForm Component
interface AuthFormProps {
  type: "signup" | "signin";
  // onUsernameChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void; //request form single input change
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

type AuthFormInput = { 
  email: string;
  password: string;
};

export function AuthForm({ 
  type, 
//   onUsernameChange, 
  onEmailChange, 
  onPasswordChange, 
  onSubmit 
}: AuthFormProps) {
  const navigate = useNavigate(); // useNavigate is a hook from react-router-dom that allows you to programmatically navigate to different routes in your application. In this case, it's used to redirect the user to the "/Blog" route after successful authentication.
  const isSignUp = type === "signup";
  const [postinput, setPostinput] = useState<AuthFormInput>({
    email: "",
    password: "",
  });

  async function sendrequest() {
  try {
    const schema = isSignUp ? signupInput : signinInput;

    const result = schema.safeParse(postinput); //! what is the meaning of safeparse  yaha pe data aagya hai 
    //! zod validation yahi pe ho gya hai 
    if (!result.success) {
      console.log(result.error);
      return;
    }

    const response = await axios.post(
      `http://localhost:8787/api/v1/user/${
        isSignUp ? "signup" : "signin"
      }`,
      result.data
    );

    const jwt = response.data.token;

    localStorage.setItem("jwt", jwt); // Store the JWT in local storage for future requests show in network tab

    navigate("/Blog"); // !Navigate to the blog page after successful authentication
  } catch (error) {
    console.error("Error during authentication:", error);
  }
}

  return (
    
    <div className="flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-12">
    {/* {JSON.stringify(postinput)}; */} 
      <div className="w-full max-w-sm space-y-6">
        
        {/* Dynamic Header */}
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {isSignUp ? "Create an account" : "Sign in to account"}
          </h1>
          <p className="text-sm text-gray-500">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <Link 
              to={isSignUp ? "/signin" : "/signup"} 
              className="font-medium text-black hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <form 
          className="space-y-4" 
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Conditional Username Field (Only on signup) */}
          {/* {isSignUp && onUsernameChange && (
            <LabeledInput 
              label="Username" 
              placeholder="Enter your username" 
              type="text" 
              onChange={onUsernameChange} 
            />
          )} */}

          {/* Email Field */}
          <LabeledInput 
            label="Email" 
            placeholder="m@example.com" 
            type="email" 
            onChange={(e) => {
              setPostinput((prev) => ({ ...prev, email: e.target.value }));
              onEmailChange(e);
            }}
          />

          {/* Password Field */}
          <LabeledInput 
            label="Password" 
            type="password" 
            onChange={(e) => {
              setPostinput((prev) => ({ ...prev, password: e.target.value }));
              onPasswordChange(e);
            }}
          />

          {/* Dynamic Submit Button */}
          <button
            onClick={sendrequest}
            type="submit" 
            className="w-full bg-black hover:bg-zinc-800 text-white font-medium py-2.5 px-4 rounded-md text-sm transition-colors mt-2"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}
