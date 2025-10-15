'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Bell, ArrowLeft, Search, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface YogaStudioProps {
  onNavigate?: (tab: string) => void;
}

const filterCategories = [
  { id: 'all', label: 'All', active: true },
  { id: 'beginner', label: 'Beginner', active: false },
  { id: 'intermediate', label: 'Intermediate', active: false },
  { id: 'advanced', label: 'Advanced', active: false },
  { id: 'quick', label: 'Quick Sessions', active: false },
];

const featuredClasses = [
  {
    id: 1,
    title: 'Morning Flow with Anya',
    instructor: 'Anya',
    instructorTitle: 'Certified Yoga Instructor',
    level: 'Beginner',
    duration: '25 min',
    description: 'Start your day with a gentle flow to awaken the senses and set a positive tone for the day ahead.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
  },
  {
    id: 2,
    title: 'Strength & Flexibility',
    instructor: 'Ben',
    instructorTitle: 'Vinyasa & Power Yoga Expert',
    level: 'Intermediate',
    duration: '45 min',
    description: 'A dynamic vinyasa class designed to build core strength and improve your range of motion.',
    image: 'https://images.unsplash.com/photo-1506629905607-d405b7a82d42?w=600&q=80',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: 3,
    title: 'Relaxing Evening Yoga',
    instructor: 'Chloe',
    instructorTitle: 'Restorative & Yin Yoga Specialist',
    level: 'All Levels',
    duration: '30 min',
    description: 'Wind down with a calming session focused on deep stretching and mindfulness to prepare for a restful sleep.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
  },
];

const allClasses = [
  { id: 1, title: 'Yoga for Stress Relief', description: 'Reduce stress and anxiety', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 2, title: 'Yoga for Back Pain', description: 'Alleviate back pain', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80' },
  { id: 3, title: 'Prenatal Yoga', description: 'Gentle yoga for mothers', image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80' },
  { id: 4, title: 'Postnatal Yoga', description: 'Regain strength', image: 'https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=400&q=80' },
  { id: 5, title: 'Yoga for Athletes', description: 'Improve performance', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { id: 6, title: 'Yoga for Beginners', description: 'Introduction to basics', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' },
  { id: 7, title: 'Chair Yoga', description: 'Accessible for all', image: 'https://images.unsplash.com/photo-1506629905607-d405b7a82d42?w=400&q=80' },
  { id: 8, title: 'Meditation & Yoga', description: 'Mind and body connection', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
];

export default function YogaStudio({ onNavigate }: YogaStudioProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handlePlayClass = (classTitle: string) => {
    alert(`Starting ${classTitle}. This would typically open a video player or booking system.`);
  };

  const handleClassClick = (classTitle: string) => {
    alert(`Opening ${classTitle} details. This would show more information about the class.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate?.('professionals')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Jiwo.AI</h1>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Find Your Flow
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover yoga practices to calm your mind and energize your body.
            </p>
          </header>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 flex items-center pl-4 h-full w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for yoga classes, styles, or instructors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-white/50 dark:bg-black/50 border border-transparent focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-shadow"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
            {filterCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                variant={activeFilter === category.id ? "default" : "outline"}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  activeFilter === category.id
                    ? 'bg-primary text-white shadow-md hover:shadow-lg'
                    : 'bg-white/50 dark:bg-black/50 hover:bg-primary/20 dark:hover:bg-primary/30'
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Featured Classes */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Featured Classes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredClasses.map((yogaClass) => (
                <Card 
                  key={yogaClass.id}
                  className="bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative">
                    <div 
                      className="w-full aspect-video bg-cover bg-center"
                      style={{ backgroundImage: `url("${yogaClass.image}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-bold text-lg">{yogaClass.title}</h4>
                      <p className="text-sm">{yogaClass.level} • {yogaClass.duration}</p>
                    </div>
                    <button 
                      onClick={() => handlePlayClass(yogaClass.title)}
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/80 text-white flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Play className="h-6 w-6 ml-1" />
                    </button>
                  </div>
                  <CardContent className="p-6">
                    <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {yogaClass.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <img 
                        alt={yogaClass.instructor}
                        className="w-10 h-10 rounded-full object-cover"
                        src={yogaClass.instructorImage}
                      />
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{yogaClass.instructor}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{yogaClass.instructorTitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* All Classes */}
          <section>
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">All Classes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {allClasses.map((yogaClass) => (
                <Card 
                  key={yogaClass.id}
                  className="bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => handleClassClick(yogaClass.title)}
                >
                  <div 
                    className="w-full aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url("${yogaClass.image}")` }}
                  />
                  <CardContent className="p-4">
                    <h5 className="font-bold truncate group-hover:text-primary transition-colors text-gray-800 dark:text-white">
                      {yogaClass.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {yogaClass.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'hover:bg-white/50 dark:hover:bg-black/50'
                  }`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/30 dark:bg-black/30 backdrop-blur-sm mt-16 border-t border-white/20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Jiwo.AI. All rights reserved.</p>
          <p className="text-sm mt-2">Find your peace, find your strength, find your Jiwo.</p>
        </div>
      </footer>
    </div>
  );
}