'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MobileNavigation, DesktopSidebar, MobileHeader } from '@/components/navigation';
import Dashboard from '@/components/dashboard';
import MoodCheckin from '@/components/mood-checkin';
import AIChat from '@/components/ai-chat';
import Journal from '@/components/journal';
import SelfScreening from '@/components/self-screening';
import WeeklyInsights from '@/components/weekly-insights';
import ProfessionalCare from '@/components/professional-care';
import YogaStudio from '@/components/yoga-studio';
import ArtTherapy from '@/components/art-therapy';
import FloatingActionButton from '@/components/floating-action-button';
import SubscriptionBanner from '@/components/subscription-banner';
import TopicSelection from '@/components/topic-selection';

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [selectedWebhookUrl, setSelectedWebhookUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/landing');
      } else {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/landing');
      } else {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleNavigateToChat = (tab: string) => {
    if (tab === 'chat') {
      setShowTopicSelection(true);
      setActiveTab('chat');
    } else {
      setActiveTab(tab);
    }
  };

  const handleTopicSelect = (topic: string, webhookUrl: string) => {
    setSelectedWebhookUrl(webhookUrl);
    setShowTopicSelection(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // Show topic selection when navigating to chat
    if (activeTab === 'chat' && showTopicSelection) {
      return <TopicSelection onTopicSelect={handleTopicSelect} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <SubscriptionBanner userId={userId || undefined} />
            <Dashboard onNavigate={handleNavigateToChat} />
          </div>
        );
      case 'mood':
        return <MoodCheckin />;
      case 'chat':
        return <AIChat webhookUrl={selectedWebhookUrl} />;
      case 'journal':
        return <Journal />;
      case 'screening':
        return <SelfScreening onNavigate={setActiveTab} />;
      case 'insights':
        return <WeeklyInsights onNavigate={setActiveTab} />;
      case 'professionals':
        return <ProfessionalCare onNavigate={setActiveTab} />;
      case 'yoga-studio':
        return <YogaStudio onNavigate={setActiveTab} />;
      case 'art-therapy':
        return <ArtTherapy onNavigate={setActiveTab} />;
      default:
        return (
          <div className="space-y-4">
            <SubscriptionBanner userId={userId || undefined} />
            <Dashboard onNavigate={handleNavigateToChat} />
          </div>
        );
    }
  };

  // For dashboard, screening, insights, professionals, yoga-studio, art-therapy, and topic selection, render full screen
  if (activeTab === 'dashboard' || activeTab === 'screening' || activeTab === 'insights' || activeTab === 'professionals' || activeTab === 'yoga-studio' || activeTab === 'art-therapy' || showTopicSelection) {
    return (
      <div className="min-h-screen bg-background">
        {renderContent()}
      </div>
    );
  }

  // For other tabs, use the original layout with navigation
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar activeTab={activeTab} onTabChange={handleNavigateToChat} />
      
      {/* Mobile Header */}
      <MobileHeader activeTab={activeTab} onTabChange={handleNavigateToChat} />
      
      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={handleNavigateToChat} />
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => handleNavigateToChat('chat')}
        isVisible={activeTab !== 'chat'}
      />
    </div>
  );
}