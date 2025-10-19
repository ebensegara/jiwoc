"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to home
        router.replace('/');
      } else {
        setCheckingAuth(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user profile exists, create if not
        if (data.user) {
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("id", data.user.id)
            .single();

          if (!existingUser) {
            // Create user profile if it doesn't exist
            await supabase
              .from("users")
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  full_name: data.user.user_metadata?.full_name || "",
                },
              ]);
          }
        }

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });

        // Redirect to home (dashboard)
        router.replace("/");
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        // Create user profile immediately
        if (data.user) {
          await supabase
            .from("users")
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
              },
            ]);
        }

        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        });

        // Auto login after signup
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!loginError) {
          // Redirect to home (dashboard)
          router.replace("/");
        } else {
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login with Google",
        variant: "destructive",
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to login with Facebook",
        variant: "destructive",
      });
    }
  };

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e6e2df] to-[#9e8d7d] dark:from-[#1a1618] dark:to-[#4d4349]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#765567] mx-auto"></div>
          <p className="mt-4 text-[#9e8d7d] dark:text-[#7c6a76]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#e6e2df] to-[#9e8d7d] dark:from-[#1a1618] dark:to-[#4d4349]">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#161315] dark:text-[#f7f7f7]">
            Jiwo.AI
          </h1>
          <p className="text-[#9e8d7d] dark:text-[#7c6a76] mt-2">
            Your companion for mental wellness.
          </p>
        </div>

        <div className="bg-[#e6e2df]/50 dark:bg-[#1a1618]/50 p-8 rounded-xl shadow-2xl backdrop-blur-lg">
          {/* Tab Switcher */}
          <div className="flex border-b border-[#9e8d7d]/30 dark:border-[#7c6a76]/30 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                isLogin
                  ? "border-b-2 border-[#765567] text-[#765567]"
                  : "text-[#9e8d7d] dark:text-[#7c6a76] hover:text-[#765567] dark:hover:text-[#765567]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                !isLogin
                  ? "border-b-2 border-[#765567] text-[#765567]"
                  : "text-[#9e8d7d] dark:text-[#7c6a76] hover:text-[#765567] dark:hover:text-[#765567]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-[#161315] dark:text-[#f7f7f7]"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                  className="mt-1 block w-full px-4 py-3 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-0 rounded-xl text-[#161315] dark:text-[#f7f7f7] placeholder-[#9e8d7d] dark:placeholder-[#7c6a76] focus:ring-2 focus:ring-[#765567] focus:outline-none"
                />
              </div>
            )}

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#161315] dark:text-[#f7f7f7]"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 block w-full px-4 py-3 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-0 rounded-xl text-[#161315] dark:text-[#f7f7f7] placeholder-[#9e8d7d] dark:placeholder-[#7c6a76] focus:ring-2 focus:ring-[#765567] focus:outline-none"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#161315] dark:text-[#f7f7f7]"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1 block w-full px-4 py-3 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-0 rounded-xl text-[#161315] dark:text-[#f7f7f7] placeholder-[#9e8d7d] dark:placeholder-[#7c6a76] focus:ring-2 focus:ring-[#765567] focus:outline-none"
              />
              {isLogin && (
                <a
                  href="#"
                  className="text-xs text-right block mt-1 text-[#9e8d7d] dark:text-[#7c6a76] hover:text-[#765567] dark:hover:text-[#765567]"
                >
                  Forgot password?
                </a>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#765567] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#765567]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#e6e2df] dark:focus:ring-offset-[#1a1618] focus:ring-[#765567] transition-all duration-300"
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          {/* Temporarily hidden
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#9e8d7d]/30 dark:border-[#7c6a76]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#e6e2df]/50 dark:bg-[#1a1618]/50 text-[#9e8d7d] dark:text-[#7c6a76]">
                Or continue with
              </span>
            </div>
          </div>
          */}

          {/* Social Login Buttons */}
          {/* Temporarily hidden
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-3 px-4 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 text-[#161315] dark:text-[#f7f7f7] rounded-lg font-medium hover:bg-[#765567]/10 dark:hover:bg-[#765567]/20 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-3"
                height="48px"
                viewBox="0 0 48 48"
                width="48px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                  fill="#4285F4"
                ></path>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center py-3 px-4 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 text-[#161315] dark:text-[#f7f7f7] rounded-lg font-medium hover:bg-[#765567]/10 dark:hover:bg-[#765567]/20 transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-3"
                height="48"
                viewBox="0 0 48 48"
                width="48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                  fill="#3b5998"
                ></path>
                <path
                  d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
                  fill="#fff"
                ></path>
              </svg>
              Continue with Facebook
            </button>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}