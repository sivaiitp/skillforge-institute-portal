
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CareerCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Plan Your Career?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Book a free career consultation session with our experts and get personalized guidance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/contact')}
          >
            Book Free Consultation
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-blue-600"
            onClick={() => navigate('/contact')}
          >
            Take Skill Assessment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CareerCTA;
