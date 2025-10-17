'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Bell, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface SelfScreeningProps {
  onNavigate?: (tab: string) => void;
}

const questions = [
  {
    id: 'q1',
    text: 'Seberapa sering Anda merasa sedih, depresi, atau putus asa dalam dua minggu terakhir?',
    number: 1,
  },
  {
    id: 'q2', 
    text: 'Seberapa sering Anda mengalami kesulitan tidur, sering terbangun, atau tidur terlalu banyak?',
    number: 2,
  },
  {
    id: 'q3',
    text: 'Seberapa sering Anda merasa lelah atau kurang energi?',
    number: 3,
  },
  {
    id: 'q4',
    text: 'Seberapa sering Anda mengalami nafsu makan berkurang atau makan berlebihan?',
    number: 4,
  },
  {
    id: 'q5',
    text: 'Seberapa sering Anda kesulitan berkonsentrasi pada hal-hal seperti membaca atau menonton televisi?',
    number: 5,
  },
];

const options = [
  { value: '0', label: 'Tidak sama sekali' },
  { value: '1', label: 'Beberapa hari' },
  { value: '2', label: 'Lebih dari setengah hari' },
  { value: '3', label: 'Hampir setiap hari' },
];

export default function SelfScreening({ onNavigate }: SelfScreeningProps) {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value || '0'), 0);

      const { error } = await supabase.from("screenings").insert([
        {
          user_id: user.id,
          screening_type: 'mental_health',
          score: totalScore,
          responses: answers,
          severity_level: totalScore <= 4 ? 'minimal' : totalScore <= 9 ? 'mild' : totalScore <= 14 ? 'moderate' : 'severe'
        },
      ]);

      if (error) throw error;

      setScore(totalScore);
      setIsSubmitted(true);

      toast({
        title: "Penilaian Selesai",
        description: "Hasil Anda telah disimpan.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal menyimpan hasil",
        variant: "destructive",
      });
    }
  };

  const getScoreInterpretation = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value || '0'), 0);
    
    if (totalScore <= 4) return { 
      level: 'Minimal', 
      color: 'text-green-600', 
      description: 'Respons Anda menunjukkan gejala minimal.',
      recommendation: 'Anda dalam kondisi baik! Pertahankan kesehatan mental Anda dengan:',
      suggestions: [
        'Life Coaching untuk pengembangan diri',
        'Yoga Studio untuk relaksasi',
        'Art Therapy untuk ekspresi kreatif'
      ]
    };
    if (totalScore <= 9) return { 
      level: 'Ringan', 
      color: 'text-yellow-600', 
      description: 'Respons Anda menunjukkan gejala ringan.',
      recommendation: 'Anda mungkin mengalami stres ringan. Disarankan untuk:',
      suggestions: [
        'Life Coaching untuk dukungan emosional',
        'Yoga Studio untuk mengurangi stres',
        'Art Therapy untuk healing kreatif',
        'Konsultasi dengan Psikolog jika gejala berlanjut'
      ]
    };
    if (totalScore <= 14) return { 
      level: 'Sedang', 
      color: 'text-orange-600', 
      description: 'Respons Anda menunjukkan gejala sedang.',
      recommendation: 'Kami sangat menyarankan Anda untuk:',
      suggestions: [
        'Konsultasi dengan Psikolog untuk terapi',
        'Life Coaching sebagai dukungan tambahan',
        'Yoga dan Art Therapy sebagai terapi komplementer'
      ]
    };
    return { 
      level: 'Berat', 
      color: 'text-red-600', 
      description: 'Respons Anda menunjukkan gejala yang signifikan.',
      recommendation: 'Segera konsultasi dengan profesional:',
      suggestions: [
        'Psikiater untuk evaluasi medis dan pengobatan',
        'Psikolog untuk terapi intensif',
        'Dukungan keluarga dan teman terdekat'
      ]
    };
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id]);

  if (isSubmitted) {
    const interpretation = getScoreInterpretation();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Penilaian Selesai
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Terima kasih telah menyelesaikan penilaian kesehatan mental.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Hasil Anda</h3>
                  <p className={`text-xl font-bold ${interpretation.color} mb-2`}>
                    Gejala {interpretation.level}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {interpretation.description}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
                    {interpretation.recommendation}
                  </h3>
                  <ul className="space-y-2">
                    {interpretation.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-semibold mb-1">⚠️ Catatan Penting:</p>
                  <p>Penilaian ini bukan diagnosis medis. Silakan konsultasi dengan profesional kesehatan mental untuk evaluasi dan dukungan yang tepat.</p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => onNavigate?.('professionals')}
                    className="w-full bg-primary"
                  >
                    Lihat Profesional
                  </Button>
                  <Button 
                    onClick={() => onNavigate?.('dashboard')}
                    variant="outline"
                    className="w-full"
                  >
                    Kembali ke Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jiwo.AI</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </button>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Resources
              </a>
              <a className="text-sm font-medium hover:text-primary transition-colors" href="#">
                Community
              </a>
            </nav>
            
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
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
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  Penilaian Kesehatan Mental
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Jawab pertanyaan-pertanyaan ini untuk membantu kami memahami kondisi Anda saat ini. 
                  Respons Anda bersifat rahasia dan akan membantu kami memberikan dukungan yang tepat.
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-10">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white pr-4">
                        {question.text}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {question.number} of {questions.length}
                      </p>
                    </div>
                    
                    <RadioGroup
                      value={answers[question.id] || ''}
                      onValueChange={(value) => handleAnswerChange(question.id, value)}
                      className="space-y-3"
                    >
                      {options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-4">
                          <Label
                            htmlFor={`${question.id}-${option.value}`}
                            className="flex items-center gap-4 cursor-pointer p-4 rounded-lg border-2 border-transparent bg-gray-50 dark:bg-gray-800 has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/20 transition-all flex-1"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`${question.id}-${option.value}`}
                              className="text-primary"
                            />
                            <span className="text-sm font-medium">{option.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                {/* Submit Button */}
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kirim Penilaian
                  </Button>
                  {!allQuestionsAnswered && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                      Mohon jawab semua pertanyaan untuk mengirim penilaian
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}