
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, User, Target, Clock, MapPin, Star, CheckCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CareerPreferences {
  career_path: string;
  target_companies: string[];
  current_experience: string;
  learning_timeline: string;
  specific_goals: string;
  current_skills: string[];
  preferred_learning_style: string;
  availability_hours_per_week: number;
}

const PersonalizedAssessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<CareerPreferences>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  const steps = [
    {
      title: "Career Path",
      description: "What's your target career?",
      icon: Target
    },
    {
      title: "Experience Level",
      description: "What's your current experience?",
      icon: User
    },
    {
      title: "Timeline & Goals",
      description: "When do you want to achieve your goals?",
      icon: Clock
    },
    {
      title: "Skills & Preferences",
      description: "Tell us about your current skills",
      icon: Star
    }
  ];

  const careerPaths = [
    { value: 'web_development', label: 'Web Development', description: 'Frontend, backend, and full-stack development' },
    { value: 'data_science', label: 'Data Science', description: 'Data analysis, machine learning, and AI' },
    { value: 'mobile_development', label: 'Mobile Development', description: 'iOS, Android, and cross-platform apps' },
    { value: 'devops', label: 'DevOps Engineering', description: 'Infrastructure, automation, and deployment' },
    { value: 'cybersecurity', label: 'Cybersecurity', description: 'Security analysis and protection' },
    { value: 'ai_ml', label: 'AI & Machine Learning', description: 'Artificial intelligence and ML engineering' },
    { value: 'cloud_computing', label: 'Cloud Computing', description: 'AWS, Azure, and cloud architecture' },
    { value: 'ui_ux_design', label: 'UI/UX Design', description: 'User interface and experience design' }
  ];

  const experienceLevels = [
    { value: 'absolute_beginner', label: 'Absolute Beginner', description: 'No prior experience' },
    { value: 'some_exposure', label: 'Some Exposure', description: 'Basic knowledge or tutorials' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some projects or work experience' },
    { value: 'advanced', label: 'Advanced', description: 'Professional experience' }
  ];

  const timelines = [
    { value: 'within_3_months', label: '3 Months', description: 'Intensive learning' },
    { value: 'within_6_months', label: '6 Months', description: 'Balanced approach' },
    { value: 'within_1_year', label: '1 Year', description: 'Comprehensive learning' },
    { value: 'flexible', label: 'Flexible', description: 'Learn at my own pace' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_career_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Preferences saved! Generating your personalized roadmap...');
      
      // Navigate to a personalized roadmap page or assessment
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error saving preferences');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePreferences = (key: keyof CareerPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Choose Your Career Path</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {careerPaths.map((path) => (
                <Card 
                  key={path.value}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    preferences.career_path === path.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => updatePreferences('career_path', path.value)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{path.label}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">What's Your Experience Level?</h3>
            <div className="space-y-3">
              {experienceLevels.map((level) => (
                <Card
                  key={level.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    preferences.current_experience === level.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => updatePreferences('current_experience', level.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{level.label}</h4>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      {preferences.current_experience === level.value && (
                        <CheckCircle className="text-blue-500" size={20} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Timeline & Goals</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">When do you want to achieve your career goals?</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {timelines.map((timeline) => (
                      <Card
                        key={timeline.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          preferences.learning_timeline === timeline.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => updatePreferences('learning_timeline', timeline.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{timeline.label}</h4>
                              <p className="text-sm text-gray-600">{timeline.description}</p>
                            </div>
                            {preferences.learning_timeline === timeline.value && (
                              <CheckCircle className="text-blue-500" size={20} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Specific Career Goals (Optional)</label>
                  <textarea
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                    placeholder="e.g., Get a job at a tech startup, build my own SaaS product, transition from marketing to tech..."
                    value={preferences.specific_goals || ''}
                    onChange={(e) => updatePreferences('specific_goals', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hours per week you can dedicate to learning</label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={preferences.availability_hours_per_week || ''}
                    onChange={(e) => updatePreferences('availability_hours_per_week', parseInt(e.target.value))}
                  >
                    <option value="">Select hours per week</option>
                    <option value={5}>5 hours (1 hour/day)</option>
                    <option value={10}>10 hours (1-2 hours/day)</option>
                    <option value={20}>20 hours (3 hours/day)</option>
                    <option value={30}>30+ hours (Full-time learning)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Skills & Learning Style</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., HTML, CSS, Excel, Photoshop, Python..."
                    value={preferences.current_skills?.join(', ') || ''}
                    onChange={(e) => updatePreferences('current_skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Learning Style</label>
                  <div className="space-y-2">
                    {['hands-on', 'theoretical', 'mixed'].map((style) => (
                      <label key={style} className="flex items-center">
                        <input
                          type="radio"
                          name="learning_style"
                          value={style}
                          checked={preferences.preferred_learning_style === style}
                          onChange={(e) => updatePreferences('preferred_learning_style', e.target.value)}
                          className="mr-2"
                        />
                        <span className="capitalize">{style.replace('-', ' ')} Learning</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Companies (Optional)</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., Google, Netflix, Local startups..."
                    value={preferences.target_companies?.join(', ') || ''}
                    onChange={(e) => updatePreferences('target_companies', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!preferences.career_path;
      case 1:
        return !!preferences.current_experience;
      case 2:
        return !!preferences.learning_timeline && !!preferences.availability_hours_per_week;
      case 3:
        return !!preferences.preferred_learning_style;
      default:
        return false;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Personalized Career Assessment
            </h1>
            <p className="text-xl text-gray-600">Tell us about yourself to get a custom learning roadmap</p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < currentStep ? <CheckCircle size={20} /> : <step.icon size={20} />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>

          {/* Step content */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <steps[currentStep].icon className="text-blue-600" />
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {currentStep === steps.length - 1 ? (
                isSubmitting ? 'Creating Roadmap...' : 'Create My Roadmap'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PersonalizedAssessment;
