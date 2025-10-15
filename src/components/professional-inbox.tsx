'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import ChatWindow from './care-chat/ChatWindow';

interface Channel {
  id: string;
  user_id: string;
  professional_id: string;
  status: string;
  created_at: string;
  user_name?: string;
  last_message?: string;
  unread_count?: number;
}

export default function ProfessionalInbox() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    initializeInbox();
  }, []);

  const initializeInbox = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access your inbox',
          variant: 'destructive',
        });
        return;
      }

      setCurrentUserId(user.id);

      // Fetch all channels for this professional
      const { data: channelsData, error: channelsError } = await supabase
        .from('chat_channels')
        .select(`
          *,
          users!chat_channels_user_id_fkey(id, email)
        `)
        .eq('professional_id', user.id)
        .order('updated_at', { ascending: false });

      if (channelsError) throw channelsError;

      // Fetch last message for each channel
      const channelsWithMessages = await Promise.all(
        (channelsData || []).map(async (channel) => {
          const { data: lastMessage } = await supabase
            .from('care_chat_messages')
            .select('message, created_at')
            .eq('channel_id', channel.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...channel,
            user_name: channel.users?.email?.split('@')[0] || 'User',
            last_message: lastMessage?.message || 'No messages yet',
          };
        })
      );

      setChannels(channelsWithMessages);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load inbox',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-[#8B6CFD]" />
            Professional Inbox
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage conversations with your clients
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading conversations...</p>
            </CardContent>
          </Card>
        ) : channels.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground">
                When users reach out to you, their conversations will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full p-4 border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                        selectedChannel?.id === channel.id ? 'bg-slate-100 dark:bg-slate-800' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#8B6CFD] flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm truncate">{channel.user_name}</h4>
                            <Badge variant={channel.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {channel.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {channel.last_message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(channel.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedChannel ? (
                <div className="relative">
                  <ChatWindow
                    professionalId={selectedChannel.professional_id}
                    professionalName={selectedChannel.user_name || 'User'}
                    onClose={() => setSelectedChannel(null)}
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select a conversation to view messages
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedChannel && (
        <ChatWindow
          professionalId={selectedChannel.professional_id}
          professionalName={selectedChannel.user_name || 'User'}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}
