"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Building2, User, Settings, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCorporateAdmin, setIsCorporateAdmin] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace("/auth");
        return;
      }

      // Get user role from users table
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = userData?.role || "user";
      setUserRole(role);

      // Check if user is admin - redirect immediately
      if (role === "admin") {
        router.replace("/dashboard/admin");
        return;
      }

      // Check if user is a company admin
      const { data: adminData } = await supabase
        .from("company_admins")
        .select("id, companies(name)")
        .eq("user_id", user.id)
        .single();

      if (adminData) {
        // User is a company admin - show dashboard selection
        setIsCorporateAdmin(true);
        setCompanyName(adminData.companies?.name || "");
        setIsLoading(false);
        return;
      }

      // Check if user is a professional
      const { data: professional, error: profError } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (professional && !profError) {
        // User is a professional
        router.replace("/dashboard/professional");
      } else {
        // Regular user
        router.replace("/dashboard/user");
      }
    } catch (error) {
      // Fallback to user dashboard on error
      router.replace("/dashboard/user");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#8B6CFD] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show dashboard selection for corporate admins
  if (isCorporateAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome, HR Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {companyName && `${companyName} - `}Choose your dashboard view
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Corporate Dashboard Card */}
            <Card className="bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-[#8B6CFD]">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-[#8B6CFD]/10 rounded-full">
                    <Building2 className="h-12 w-12 text-[#8B6CFD]" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Corporate Dashboard</CardTitle>
                <CardDescription className="text-center">
                  Monitor employee wellness and company-wide analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Employee wellness metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Department insights & trends
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    AI-powered recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Real-time alerts & notifications
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#8B6CFD] hover:bg-[#7A5CE8]"
                  onClick={() => router.push("/dashboard/corporate")}
                >
                  Open Corporate Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Personal Dashboard Card */}
            <Card className="bg-white dark:bg-slate-800 hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-[#8B6CFD]">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-[#8B6CFD]/10 rounded-full">
                    <User className="h-12 w-12 text-[#8B6CFD]" />
                  </div>
                </div>
                <CardTitle className="text-center text-xl">Personal Dashboard</CardTitle>
                <CardDescription className="text-center">
                  Access your personal wellness journey and tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Personal mood tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Journal & self-reflection
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Book professional sessions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#8B6CFD]" />
                    Wellness activities & resources
                  </li>
                </ul>
                <Button 
                  className="w-full bg-[#8B6CFD] hover:bg-[#7A5CE8]"
                  onClick={() => router.push("/dashboard/user")}
                >
                  Open Personal Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Need to add another company?
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/corporate/setup")}
              className="text-[#8B6CFD] border-[#8B6CFD] hover:bg-[#8B6CFD]/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              Set Up New Company
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}