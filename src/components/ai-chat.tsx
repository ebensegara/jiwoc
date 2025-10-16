'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const N8N_WEBHOOK_URL = 'https://dindon.app.n8n.cloud/webhook/6f49e2fe-d2ff-427b-8e79-6628403ebb73';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: string;
}

const aiResponses = [
  "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been on your mind?",
  "It sounds like you're going through a challenging time. Remember that it's okay to feel this way, and you're not alone.",
  "That's wonderful to hear! It's great that you're taking time to check in with yourself. What's been contributing to these positive feelings?",
  "Thank you for sharing that with me. Sometimes just talking about our experiences can be really helpful. How does it feel to express these thoughts?",
  "I appreciate your openness. Taking care of your mental health is so important. Have you tried any relaxation techniques that help you feel better?",
  "It's completely normal to have ups and downs. What usually helps you when you're feeling this way?",
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('chat_messages_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Add welcome message if no messages exist
        const welcomeMessage = {
          id: 'welcome',
          content: "Hello! I'm your wellness companion. I'm here to listen and support you on your mental health journey. How are you feeling today?",
          sender: 'ai' as const,
          created_at: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      } else {
        setMessages(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const userMessage = inputValue;

      // Save user message
      const { error: userError } = await supabase
        .from('chat_messages')
        .insert([{
          user_id: user.id,
          content: userMessage,
          sender: 'user',
        }]);

      if (userError) throw userError;

      setInputValue('');
      setIsTyping(true);

      // Send request to n8n webhook with POST method and JSON body
      try {
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            userId: user.id,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Webhook request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract AI response from webhook
        const aiResponse = data.response || data.message || data.advice || 
                          'Thank you for sharing. I\'m here to support you on your mental health journey.';

        // Save AI response to database
        const { error: aiError } = await supabase
          .from('chat_messages')
          .insert([{
            user_id: user.id,
            content: aiResponse,
            sender: 'ai',
          }]);

        if (aiError) throw aiError;

      } catch (webhookError: any) {
        console.error('Webhook error:', webhookError);
        
        // Fallback to local response if webhook fails
        const fallbackResponse = "I'm here to listen and support you. Could you tell me more about what's on your mind?";
        
        const { error: aiError } = await supabase
          .from('chat_messages')
          .insert([{
            user_id: user.id,
            content: fallbackResponse,
            sender: 'ai',
          }]);

        if (aiError) throw aiError;

        toast({
          title: 'Connection Issue',
          description: 'Using offline mode. Your messages are still saved.',
          variant: 'default',
        });
      }

      setIsTyping(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span>AI Wellness Companion</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            A safe space to share your thoughts and feelings
          </p>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 p-0">
          <ScrollArea ref={scrollAreaRef} className="h-[500px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.sender === 'ai' ? 'bg-primary/10' : 'bg-muted'}>
                      {message.sender === 'ai' ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is a supportive space. Feel free to share your thoughts and feelings.
          </p>
        </div>
      </Card>
    </div>
  );
}