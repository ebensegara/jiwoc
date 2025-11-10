"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, MessageCircle, Star, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatWindow from "@/components/care-chat/ChatWindow";
import BookingModal from "@/components/booking-modal";

interface Professional {
  id: string;
  full_name: string;
  category: string;
  specialization: string;
  bio: string;
  rating: number;
  avatar_url: string;
  is_available: boolean;
  price_per_session: number;
}

export default function UserDashboard() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const categories = ["all", "Psychologist", "Psychiatrist", "Life Coaching", "Nutrition", "Yoga", "Art Therapy"];

  useEffect(() => {
    fetchProfessionals();

    // PWA Back Button Handler - Exit app after 2 back presses
    let backPressCount = 0;
    let backPressTimer: NodeJS.Timeout;

    const handleBackButton = (e: PopStateEvent) => {
      backPressCount++;
      
      if (backPressCount === 1) {
        // First back press - show toast
        toast({
          title: "Press back again to exit",
          description: "Tap back once more to close the app",
          duration: 2000,
        });
        
        // Reset counter after 2 seconds
        backPressTimer = setTimeout(() => {
          backPressCount = 0;
        }, 2000);
        
        // Push state back to prevent navigation
        window.history.pushState(null, "", window.location.href);
      } else if (backPressCount === 2) {
        // Second back press - allow exit
        clearTimeout(backPressTimer);
        window.history.back();
      }
    };

    // Push initial state to enable back button handling
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    // Subscribe to availability changes
    const subscription = supabase
      .channel("professionals-availability")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "professionals",
        },
        () => {
          fetchProfessionals();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      clearTimeout(backPressTimer);
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchQuery, selectedCategory]);

  const fetchProfessionals = async () => {
    try {
      // Fetch ALL professionals to see online/offline status
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;
      
      setProfessionals(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load professionals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((prof) => prof.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (prof) =>
          prof.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  };

  const handleChatNow = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowChatModal(true);
  };

  const handleBookSession = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B6CFD]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Available Professionals
          </h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                  size="sm"
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {filteredProfessionals.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No professionals found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Check back later for available professionals"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card
                key={professional.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={professional.avatar_url} />
                      <AvatarFallback>
                        {professional.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {professional.is_available ? (
                          <Badge className="bg-green-500 text-white">
                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-400 text-white">
                            Offline
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                        {professional.full_name}
                      </h3>
                      <p className="text-sm text-[#8B6CFD] font-medium">
                        {professional.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {professional.rating}
                    </span>
                    <span className="text-sm text-gray-500">/5.0</span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {professional.bio}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-[#756657] dark:text-[#e6e2df] font-semibold">
                    <DollarSign className="h-5 w-5" />
                    <span>Rp {professional.price_per_session.toLocaleString()} / session</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBookSession(professional)}
                      className="flex-1 bg-[#756657] hover:bg-[#756657]/90 text-white"
                    >
                      Book Session
                    </Button>
                    <Button
                      onClick={() => handleChatNow(professional)}
                      variant="outline"
                      className="flex-1"
                      disabled={!professional.is_available}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {professional.is_available ? "Chat" : "Offline"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Chat Window Modal */}
      {showChatModal && selectedProfessional && (
        <ChatWindow
          professionalId={selectedProfessional.id}
          professionalName={selectedProfessional.full_name}
          onClose={() => {
            setShowChatModal(false);
            setSelectedProfessional(null);
          }}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedProfessional && (
        <BookingModal
          open={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedProfessional(null);
          }}
          professional={{
            id: selectedProfessional.id,
            full_name: selectedProfessional.full_name,
            price_per_session: selectedProfessional.price_per_session,
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedProfessional(null);
          }}
        />
      )}
    </div>
  );
}