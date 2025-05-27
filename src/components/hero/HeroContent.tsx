
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroContentProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  features: string[];
  navigate: (path: string) => void;
}

const HeroContent = ({ title, description, buttonText, buttonLink, features, navigate }: HeroContentProps) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          onClick={() => navigate(buttonLink)}
        >
          {buttonText}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default HeroContent;
