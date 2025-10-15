'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import ChatLauncher from './care-chat/ChatLauncher';

interface Professional {
  id: string;
  title: string;
  category: string;
  specialization: string;
  bio: string;
  rating: number;
  photo_url: string;
  contact_email: string;
}

interface ProfessionalListProps {
  category?: string;
  onBack?: () => void;
}

export default function ProfessionalList({ category = "all", onBack }: ProfessionalListProps) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfessionals() {
      setIsLoading(true);
      try {
        let query = supabase
          .from('professionals')
          .select('*');
        
        if (category !== "all") {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        setProfessionals(data || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch professionals',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfessionals();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Care Options
            </Button>
          )}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {category === "all" ? "All" : category} Professionals
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect with verified professionals who can support your mental wellness journey
          </p>
        </div>

        {/* Professionals Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading professionals...</p>
          </div>
        ) : professionals.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No professionals found for this category. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{professional.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {professional.specialization}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-700">
                        {professional.rating}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {professional.bio}
                  </p>

                  <div className="pt-4">
                    <ChatLauncher
                      professionalId={professional.id}
                      professionalName={professional.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}