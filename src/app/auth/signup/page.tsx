"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"user" | "professional">("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        router.replace('/dashboard/user');
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
      // Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role, // Add role to auth metadata
          },
        },
      });

      if (error) throw error;

      // Create user profile immediately with UPSERT
      if (data.user) {
        const { error: profileError } = await supabase
          .from("users")
          .upsert(
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              role: role, // Explicitly set role
            },
            {
              onConflict: "id",
              ignoreDuplicates: false,
            }
          );

        if (profileError) {
          throw profileError; // Stop if profile creation fails
        }

        // If professional, create professional profile
        if (role === "professional") {
          const { error: professionalError } = await supabase
            .from("professionals")
            .upsert(
              {
                user_id: data.user.id,
                specialization: "",
                bio: "",
                photo_url: "",
              },
              {
                onConflict: "user_id",
                ignoreDuplicates: false,
              }
            );

          if (professionalError) {
            throw professionalError; // Stop if professional profile creation fails
          }
        }
      }

      toast({
        title: "Account created!",
        description: `You are registered as a ${role}.`,
      });

      // Auto login after signup
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!loginError) {
        // Redirect directly to dashboard based on role
        if (role === "professional") {
          router.replace("/dashboard/professional");
        } else {
          router.replace("/dashboard/user");
        }
      } else {
        router.replace("/auth");
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
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 text-[#161315] dark:text-[#f7f7f7] hover:bg-[#765567]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#161315] dark:text-[#f7f7f7]">
            Jiwo.AI
          </h1>
          <p className="text-[#9e8d7d] dark:text-[#7c6a76] mt-2">
            Create your account
          </p>
        </div>

        <div className="bg-[#e6e2df]/50 dark:bg-[#1a1618]/50 p-8 rounded-xl shadow-2xl backdrop-blur-lg">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
                className="mt-1 block w-full px-4 py-3 bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-0 rounded-xl text-[#161315] dark:text-[#f7f7f7] placeholder-[#9e8d7d] dark:placeholder-[#7c6a76] focus:ring-2 focus:ring-[#765567] focus:outline-none"
              />
            </div>

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

            {/* Role Selection */}
            <div>
              <Label className="text-sm font-medium text-[#161315] dark:text-[#f7f7f7] mb-3 block">
                Select Your Role
              </Label>
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                    role === "user"
                      ? "bg-[#765567]/20 border-2 border-[#765567]"
                      : "bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-2 border-transparent hover:border-[#765567]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={() => setRole("user")}
                    className="w-5 h-5 mt-0.5 text-[#765567] accent-[#765567]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-base text-[#161315] dark:text-[#f7f7f7] block">
                      User
                    </span>
                    <p className="text-xs text-[#9e8d7d] dark:text-[#7c6a76] mt-1">
                      I'm looking for mental health support
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                    role === "professional"
                      ? "bg-[#765567]/20 border-2 border-[#765567]"
                      : "bg-[#e6e2df]/70 dark:bg-[#1a1618]/70 border-2 border-transparent hover:border-[#765567]/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="professional"
                    checked={role === "professional"}
                    onChange={() => setRole("professional")}
                    className="w-5 h-5 mt-0.5 text-[#765567] accent-[#765567]"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-base text-[#161315] dark:text-[#f7f7f7] block">
                      Professional
                    </span>
                    <p className="text-xs text-[#9e8d7d] dark:text-[#7c6a76] mt-1">
                      I'm a mental health professional
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#765567] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#765567]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#e6e2df] dark:focus:ring-offset-[#1a1618] focus:ring-[#765567] transition-all duration-300"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#9e8d7d] dark:text-[#7c6a76]">
              Already have an account?{" "}
              <a
                href="/auth"
                className="text-[#765567] hover:underline font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}