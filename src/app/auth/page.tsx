"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("id", data.user.id)
            .single();

          if (!existingUser) {
            await supabase
              .from("users")
              .insert([
                {
                  id: data.user.id,
                  email: data.user.email,
                  full_name: data.user.user_metadata?.full_name || "",
                  role: "user",
                },
              ]);
          }

          toast({
            title: "Welcome back!",
            description: "You've successfully logged in.",
          });

          router.replace("/dashboard");
        }
      } else {
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

        if (data.user) {
          await supabase
            .from("users")
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: fullName,
                role: "user",
              },
            ]);
        }

        toast({
          title: "Account created!",
          description: "You can now log in with your credentials.",
        });

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!loginError) {
          router.replace("/dashboard");
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
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B6CFD] hover:bg-[#7A5CE8]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "Sign In" : "Sign Up"}</>
              )}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#8B6CFD] hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Are you an HR Admin?
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/corporate/setup")}
                  className="text-sm text-[#8B6CFD] hover:underline font-medium"
                >
                  Set up Corporate Wellness Program →
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}