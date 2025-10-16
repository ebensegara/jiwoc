"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ChatMessageList from "@/components/care-chat/ChatMessageList";
import ChatInput from "@/components/care-chat/ChatInput";

interface UserChannel {
  id: string;
  user_id: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  unread_count?: number;
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export default function ProfessionalDashboard() {
  const [professional, setProfessional] = useState<any>(null);
  const [channels, setChannels] = useState<UserChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<UserChannel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useOnlineStatus(professional?.id || "");

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (!professional) return;

    // Subscribe to new channels
    const channelSubscription = supabase
      .channel("professional-channels")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_channels",
          filter: `professional_id=eq.${professional.id}`,
        },
        () => {
          fetchChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSubscription);
    };
  }, [professional]);

  useEffect(() => {
    if (!selectedChannel) return;

    fetchMessages(selectedChannel.id);

    // Subscribe to new messages
    const messageSubscription = supabase
      .channel(`messages:${selectedChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "care_chat_messages",
          filter: `channel_id=eq.${selectedChannel.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [selectedChannel]);

  const initializeDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the dashboard",
          variant: "destructive",
        });
        return;
      }

      console.log("Current user ID:", user.id);

      // Fetch professional profile
      const { data: profData, error: profError } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      console.log("Professional data:", profData, "Error:", profError);

      if (profError) {
        toast({
          title: "Not a Professional",
          description: "You don't have a professional profile. Redirecting...",
          variant: "destructive",
        });
        // Redirect to user dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/dashboard/user";
        }, 2000);
        return;
      }

      setProfessional(profData);
      setIsOnline(profData.is_available || false);

      await fetchChannels(profData.id);
    } catch (error: any) {
      console.error("Dashboard init error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannels = async (professionalId?: string) => {
    const profId = professionalId || professional?.id;
    if (!profId) return;

    try {
      console.log("Fetching channels for professional:", profId);
      
      const { data, error } = await supabase
        .from("chat_channels")
        .select(`
          id,
          user_id,
          created_at,
          users!chat_channels_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq("professional_id", profId)
        .order("created_at", { ascending: false });

      console.log("Channels data:", data, "Error:", error);

      if (error) throw error;

      const formattedChannels = data.map((channel: any) => ({
        id: channel.id,
        user_id: channel.user_id,
        created_at: channel.created_at,
        user: {
          full_name: channel.users?.full_name || "Unknown User",
          email: channel.users?.email || "No email",
        },
      }));

      setChannels(formattedChannels);
    } catch (error: any) {
      console.error("Failed to fetch channels:", error);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const { data, error } = await supabase
        .from("care_chat_messages")
        .select("*")
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleToggleOnline = async (checked: boolean) => {
    if (!professional) return;

    try {
      const { error } = await supabase
        .from("professionals")
        .update({ is_available: checked })
        .eq("id", professional.id);

      if (error) throw error;

      setIsOnline(checked);
      toast({
        title: checked ? "You're now online" : "You're now offline",
        description: checked
          ? "Users can now see you and start conversations"
          : "You won't appear in the available professionals list",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedChannel || !professional) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("care_chat_messages")
        .insert([{
          channel_id: selectedChannel.id,
          sender_id: user.id,
          message,
        }]);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={professional?.photo_url} />
                <AvatarFallback>
                  {professional?.title?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {professional?.title || "Professional Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {professional?.specialization}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isOnline ? "Online" : "Offline"}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleToggleOnline}
              />
              {isOnline && (
                <Badge className="bg-green-500">Available</Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Left Sidebar - Chat List */}
          <Card className="lg:col-span-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-white dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Active Chats ({channels.length})
              </h2>
            </div>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {channels.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active chats yet</p>
                  <p className="text-sm mt-1">
                    Users will appear here when they message you
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                        selectedChannel?.id === channel.id
                          ? "bg-[#8B6CFD]/10 border-l-4 border-[#8B6CFD]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {channel.user.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 dark:text-white truncate">
                            {channel.user.full_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {channel.user.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Chat Window */}
          <Card className="lg:col-span-2 overflow-hidden flex flex-col">
            {selectedChannel ? (
              <>
                <div className="p-4 border-b bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {selectedChannel.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {selectedChannel.user.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedChannel.user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <ChatMessageList
                    messages={messages}
                    currentUserId={professional?.user_id || ""}
                    professionalName={professional?.title || "Professional"}
                  />
                  <ChatInput onSendMessage={handleSendMessage} />
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Select a chat to start messaging</p>
                  <p className="text-sm mt-1">
                    Choose a user from the left sidebar
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}