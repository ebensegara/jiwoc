'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bell, ArrowLeft, User, Stethoscope, Target, Apple, Flower, Palette } from 'lucide-react';

interface ProfessionalCareProps {
  onNavigate?: (tab: string) => void;
}

const careOptions = [
  {
    id: 'psychologist',
    title: 'Psychologist',
    description: 'Therapy and counseling to navigate emotional challenges, improve coping mechanisms, and enhance well-being.',
    icon: User,
  },
  {
    id: 'psychiatrist',
    title: 'Psychiatrist',
    description: 'Medical doctors who diagnose, treat, and prescribe medication for mental health conditions.',
    icon: Stethoscope,
  },
  {
    id: 'life-coaching',
    title: 'Life Coaching',
    description: 'Guidance and support to help you set and achieve personal and professional goals.',
    icon: Target,
  },
  {
    id: 'nutrition',
    title: 'Nutrition',
    description: 'Guidance on healthy eating habits to support your mental and physical well-being.',
    icon: Apple,
  },
  {
    id: 'yoga',
    title: 'Yoga',
    description: 'Combines physical postures, breathing, and meditation to reduce stress and improve clarity.',
    icon: Flower,
  },
  {
    id: 'art-therapy',
    title: 'Art Therapy',
    description: 'Using creative processes to express emotions, gain self-awareness, and improve mental health.',
    icon: Palette,
  },
];

export default function ProfessionalCare({ onNavigate }: ProfessionalCareProps) {
  const handleExplore = (careType: string, careId: string) => {
    if (careId === 'yoga') {
      // Navigate to yoga studio page
      onNavigate?.('yoga-studio');
    } else if (careId === 'art-therapy') {
      // Navigate to art therapy page
      onNavigate?.('art-therapy');
    } else {
      // In a real app, this would navigate to other detailed pages
      console.log(`Exploring ${careType} options`);
      alert(`Exploring ${careType} options. This would typically open a detailed page with available professionals.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-transparent text-gray-800 dark:text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-6 w-6 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">Jiwo.AI</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate?.('chat')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              AI Companion
            </button>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
              Community
            </a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
              Resources
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white tracking-tight">
              Professional Care Recommendations
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Based on your needs and preferences, we've curated a list of professionals and services that align with your mental health goals.
            </p>
          </div>

          {/* Care Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card 
                  key={option.id}
                  className="bg-white/30 dark:bg-black/30 backdrop-blur-sm shadow-lg border-white/20 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {option.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 flex-grow mb-6 leading-relaxed">
                      {option.description}
                    </p>
                    
                    <Button
                      onClick={() => handleExplore(option.title, option.id)}
                      className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md"
                    >
                      Explore {option.title === 'Life Coaching' ? 'Life Coaches' : 
                              option.title === 'Nutrition' ? 'Nutritionists' :
                              option.title === 'Yoga' ? 'Yoga Studios' :
                              option.title === 'Art Therapy' ? 'Art Therapy' :
                              option.title + 's'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <Card className="bg-white/30 dark:bg-black/30 backdrop-blur-sm shadow-lg border-white/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Need Help Choosing?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                  Our AI companion can help you determine which type of professional care might be most beneficial for your specific needs and circumstances.
                </p>
                <Button
                  onClick={() => onNavigate?.('chat')}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all"
                >
                  Talk to AI Companion
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 dark:bg-black/30 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 Jiwo.AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}