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

export default function Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/landing');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/landing');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

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
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'mood':
        return <MoodCheckin />;
      case 'chat':
        return <AIChat />;
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
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  // For dashboard, screening, insights, professionals, yoga-studio, and art-therapy, render full screen without navigation
  if (activeTab === 'dashboard' || activeTab === 'screening' || activeTab === 'insights' || activeTab === 'professionals' || activeTab === 'yoga-studio' || activeTab === 'art-therapy') {
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
      <DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Mobile Header */}
      <MobileHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onClick={() => setActiveTab('chat')}
        isVisible={activeTab !== 'chat'}
      />
    </div>
  );
}