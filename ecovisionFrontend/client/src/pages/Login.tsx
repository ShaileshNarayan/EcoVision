// import { useState } from "react";
// import { useLocation } from "wouter";
// import { GoogleLogin } from "@react-oauth/google";
// import { useAuth } from "@/contexts/AuthContext";
// import { useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Leaf } from "lucide-react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// export default function Login() {
//   const [, setLocation] = useLocation();
//   const { login, loginWithGoogle,signup, isAuthenticated } = useAuth();
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [showLoginPassword, setShowLoginPassword] = useState(false);
//   const [signupName, setSignupName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
   
//   if(isAuthenticated){
//     setLocation("/profile");
//   }
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await login(loginEmail, loginPassword);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const validatePassword = (password: string) => {
//     // Minimum 8 characters, at least 1 number and 1 special character
//     const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
//     return regex.test(password);
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validatePassword(signupPassword)) {
//       setPasswordError(
//         "Password must be at least 8 characters long and include a number and a special character."
//       );
//       return;
//     }
//     setPasswordError("");
//     try {
//       await signup(signupName, signupEmail, signupPassword);
//     } catch (error) {
//       console.error("Signup failed:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-20 bg-muted/30">
//       <div className="container mx-auto px-4">
//         <div className="max-w-md mx-auto">
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-2 mb-4">
//               <Leaf className="h-8 w-8 text-primary" data-testid="icon-logo" />
//               <span className="font-heading text-2xl font-bold">EcoVision</span>
//             </div>
//             <h1
//               className="font-heading text-3xl font-bold mb-2"
//               data-testid="text-page-title"
//             >
//               Welcome Back
//             </h1>
//             <p
//               className="text-muted-foreground"
//               data-testid="text-page-subtitle"
//             >
//               Login to continue making a difference
//             </p>
//           </div>

//           <Card className="p-8">
//             <Tabs defaultValue="login" className="w-full">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="login" data-testid="tab-login">
//                   Login
//                 </TabsTrigger>
//                 <TabsTrigger value="signup" data-testid="tab-signup">
//                   Sign Up
//                 </TabsTrigger>
//               </TabsList>

//               {/* LOGIN TAB */}
//               <TabsContent value="login" className="mt-6">
//                 <form onSubmit={handleLogin} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="login-email">Email</Label>
//                     <Input
//                       id="login-email"
//                       type="email"
//                       placeholder="your.email@example.com"
//                       value={loginEmail}
//                       onChange={(e) => setLoginEmail(e.target.value)}
//                       data-testid="input-login-email"
//                     />
//                   </div>

//                   <div className="space-y-2 relative">
//                     <Label htmlFor="login-password">Password</Label>
//                     <Input
//                       id="login-password"
//                       type={showLoginPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={loginPassword}
//                       onChange={(e) => setLoginPassword(e.target.value)}
//                       data-testid="input-login-password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowLoginPassword(!showLoginPassword)
//                       }
//                       className="absolute right-3 top-9 text-gray-500"
//                       aria-label="Toggle password visibility"
//                     >
//                       {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     data-testid="button-login-submit"
//                   >
//                     Login
//                   </Button>
//                 <div className="relative flex items-center my-6">
//                 <div className="flex-grow border-t border-muted"></div>
//                 <span className="mx-3 text-xs uppercase text-muted-foreground">
//                   or
//                 </span>
//                 <div className="flex-grow border-t border-muted"></div>
//                 </div>
//                 <div className="flex justify-center mb-4">
//                   <GoogleLogin
//                     onSuccess={async (credentialResponse) => {
//                       if (credentialResponse.credential) {
//                         await loginWithGoogle(credentialResponse.credential);
//                       }
//                     }}
//                     onError={() => console.error("Google Login Failed")}
//                     theme="filled_black"
//                     shape="rectangular"
//                     text="signin_with"
//                     width="280"
//                   />
//                 </div>
//                   <p className="text-sm text-center text-muted-foreground">
//                     <a href="#" className="text-primary hover:underline">
//                       Forgot password?
//                     </a>
//                   </p>
//                 </form>
//               </TabsContent>

//               {/* SIGNUP TAB */}
//               <TabsContent value="signup" className="mt-6">
//                 <form onSubmit={handleSignup} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="signup-name">Full Name</Label>
//                     <Input
//                       id="signup-name"
//                       type="text"
//                       placeholder="John Doe"
//                       value={signupName}
//                       onChange={(e) => setSignupName(e.target.value)}
//                       data-testid="input-signup-name"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="signup-email">Email</Label>
//                     <Input
//                       id="signup-email"
//                       type="email"
//                       placeholder="your.email@example.com"
//                       value={signupEmail}
//                       onChange={(e) => setSignupEmail(e.target.value)}
//                       data-testid="input-signup-email"
//                     />
//                   </div>
//                   <div className="space-y-2 relative">
//                   <Label htmlFor="signup-password">Password</Label>
//                   <Input
//                     id="signup-password"
//                     type={showSignupPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={signupPassword}
//                     onChange={(e) => {
//                       setSignupPassword(e.target.value);
//                       if (e.target.value.length > 0) setPasswordError("");
//                     }}
//                     data-testid="input-signup-password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowSignupPassword(!showSignupPassword)}
//                     className="absolute right-3 top-9 text-gray-500"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>

//                   {/* Password Strength Indicator */}
//                   {signupPassword && (
//                     <div className="mt-2">
//                       <div className="h-2 rounded bg-gray-200 overflow-hidden">
//                         <div
//                           className={`h-2 transition-all duration-300 ${
//                             signupPassword.length < 6
//                               ? "bg-red-500 w-1/4"
//                               : signupPassword.length < 8
//                               ? "bg-yellow-500 w-2/4"
//                               : /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(signupPassword)
//                               ? "bg-green-500 w-full"
//                               : "bg-yellow-500 w-3/4"
//                           }`}
//                         ></div>
//                       </div>
//                       <p
//                         className={`text-xs mt-1 ${
//                           signupPassword.length < 6
//                             ? "text-red-500"
//                             : signupPassword.length < 8
//                             ? "text-yellow-600"
//                             : /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(signupPassword)
//                             ? "text-green-600"
//                             : "text-yellow-600"
//                         }`}
//                       >
//                         {signupPassword.length < 6
//                           ? "Weak"
//                           : signupPassword.length < 8
//                           ? "Medium"
//                           : /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(signupPassword)
//                           ? "Strong"
//                           : "Medium"}
//                       </p>
//                     </div>
//                   )}
//                 </div>


//                   {/* Password strength validation */}
//                   {passwordError && (
//                     <p className="text-red-500 text-sm mt-1">{passwordError}</p>
//                   )}

//                   <Button
//                     type="submit"
//                     className="w-full"
//                     data-testid="button-signup-submit"
//                   >
//                     Create Account
//                   </Button>
//                   <div className="relative flex items-center my-6">
//                 <div className="flex-grow border-t border-muted"></div>
//                 <span className="mx-3 text-xs uppercase text-muted-foreground">
//                   or
//                 </span>
//                 <div className="flex-grow border-t border-muted"></div>
//                 </div>
//                 <div className="flex justify-center mb-4">
//                   <GoogleLogin
//                     onSuccess={async (credentialResponse) => {
//                       if (credentialResponse.credential) {
//                         await loginWithGoogle(credentialResponse.credential);
//                       }
//                     }}
//                     onError={() => console.error("Google Login Failed")}
//                     theme="filled_black"
//                     shape="rectangular"
//                     text="signin_with"
//                     width="280"
//                   />
//                 </div>

//                   <p className="text-sm text-center text-muted-foreground">
//                     By signing up, you agree to our{" "}
//                     <a href="#" className="text-primary hover:underline">
//                       Terms & Conditions
//                     </a>
//                   </p>
//                 </form>
//               </TabsContent>
//             </Tabs>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState("");
  const { login, loginWithGoogle, signup, user, isAuthenticated } = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role?.toUpperCase();
      if (role === "ADMIN") setLocation("/admin");
      else setLocation("/profile");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
    } catch (error : any) {
      console.error("Login failed:", error);
      setLoginError("Your email or password doesn't match. Please try again.");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(signupPassword)) {
      setPasswordError("Password must be at least 8 characters long and include a number and a special character.");
      return;
    }
    setPasswordError("");
    try {
      await signup(signupName, signupEmail, signupPassword);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const validatePassword = (password: string) => /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(password);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="font-heading text-2xl font-bold">EcoVision</span>
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Login to continue making a difference</p>
          </div>

          <Card className="p-8">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* LOGIN */}
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="your.email@example.com"
                      value={loginEmail} onChange={(e) => {setLoginEmail(e.target.value);setLoginError("");}} />
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => {setLoginPassword(e.target.value); setLoginError("");}} />
                    <button type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-9 text-gray-500"
                      aria-label="Toggle password visibility">
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {loginError && (
                    <div className="w-full text-center py-2 mb-3 rounded-md 
                                    bg-red-500/10 border border-red-500/20 
                                    text-red-500 text-sm">
                      {loginError}
                    </div>
                  )}

                  <Button type="submit" className="w-full">Login</Button>

                  <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="mx-3 text-xs uppercase text-muted-foreground">or</span>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <GoogleLogin
                      onSuccess={async (response) => {
                        if (response.credential) await loginWithGoogle(response.credential);
                      }}
                      onError={() => console.error("Google Login Failed")}
                      theme="filled_black"
                      width="280"
                    />
                  </div>
                </form>
              </TabsContent>

              {/* SIGNUP */}
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" type="text" placeholder="John Doe"
                      value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="your.email@example.com"
                      value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type={showSignupPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)} />
                    <button type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-9 text-gray-500">
                      {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                  <Button type="submit" className="w-full">Create Account</Button>

                  <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-muted"></div>
                    <span className="mx-3 text-xs uppercase text-muted-foreground">or</span>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <GoogleLogin
                      onSuccess={async (response) => {
                        if (response.credential) await loginWithGoogle(response.credential);
                      }}
                      onError={() => console.error("Google Login Failed")}
                      theme="filled_black"
                      width="280"
                    />
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
