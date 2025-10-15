'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Bell, ArrowLeft } from 'lucide-react';

interface SelfScreeningProps {
  onNavigate?: (tab: string) => void;
}

const questions = [
  {
    id: 'q1',
    text: 'How often have you been bothered by feeling down, depressed, or hopeless over the last two weeks?',
    number: 1,
  },
  {
    id: 'q2', 
    text: 'How often have you had trouble falling or staying asleep, or sleeping too much?',
    number: 2,
  },
  {
    id: 'q3',
    text: 'How often have you felt tired or had little energy?',
    number: 3,
  },
  {
    id: 'q4',
    text: 'How often have you had poor appetite or overeating?',
    number: 4,
  },
  {
    id: 'q5',
    text: 'How often have you had trouble concentrating on things, such as reading or watching television?',
    number: 5,
  },
];

const options = [
  { value: '0', label: 'Not at all' },
  { value: '1', label: 'Several days' },
  { value: '2', label: 'More than half the days' },
  { value: '3', label: 'Nearly every day' },
];

export default function SelfScreening({ onNavigate }: SelfScreeningProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value || '0'), 0);
    
    console.log('Assessment submitted:', { answers, totalScore });
    setIsSubmitted(true);
    
    // Reset after showing confirmation
    setTimeout(() => {
      setIsSubmitted(false);
      setAnswers({});
    }, 3000);
  };

  const getScoreInterpretation = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value || '0'), 0);
    
    if (totalScore <= 4) return { level: 'Minimal', color: 'text-green-600', description: 'Your responses suggest minimal symptoms.' };
    if (totalScore <= 9) return { level: 'Mild', color: 'text-yellow-600', description: 'Your responses suggest mild symptoms.' };
    if (totalScore <= 14) return { level: 'Moderate', color: 'text-orange-600', description: 'Your responses suggest moderate symptoms.' };
    return { level: 'Severe', color: 'text-red-600', description: 'Your responses suggest more significant symptoms.' };
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id]);

  if (isSubmitted) {
    const interpretation = getScoreInterpretation();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Assessment Complete
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Thank you for completing the self-screening assessment.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Results</h3>
                  <p className={`text-xl font-bold ${interpretation.color} mb-2`}>
                    {interpretation.level} Symptoms
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {interpretation.description}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <p>This assessment is not a diagnosis. Please consult with a healthcare professional for proper evaluation and support.</p>
                </div>

                <Button 
                  onClick={() => onNavigate?.('dashboard')}
                  className="w-full"
                >
                  Return to Dashboard
                </Button>
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
                  Self-Screening Assessment
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Answer these questions to help us understand your current well-being. 
                  Your responses are confidential and will help us tailor support for you.
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
                    Submit Assessment
                  </Button>
                  {!allQuestionsAnswered && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                      Please answer all questions to submit the assessment
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