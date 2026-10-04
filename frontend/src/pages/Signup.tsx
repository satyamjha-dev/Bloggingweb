import { AuthForm } from "../components/auth";
import { QuoteSection } from "../components/Quote";

export const Signup = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-white">
      <AuthForm 
  type="signup" 
//   onUsernameChange={() => {}}
  onEmailChange={() => {}}
  onPasswordChange={() => {}}
  onSubmit={() => {}}
/>

      <QuoteSection />
    </div>
  );
};
