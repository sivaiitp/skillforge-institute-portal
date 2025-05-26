
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Career{" "}
              </span>
              with Expert Training
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Master cutting-edge technologies and boost your career with our industry-leading 
              software training programs. Learn from experts, practice with real projects, 
              and get certified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                View Success Stories
              </Button>
            </div>
          </div>
          
          <div className="animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">Web Dev</div>
                    <div className="text-sm text-gray-600">Full Stack</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">Data Science</div>
                    <div className="text-sm text-gray-600">ML & AI</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">Mobile Dev</div>
                    <div className="text-sm text-gray-600">iOS & Android</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">Cloud</div>
                    <div className="text-sm text-gray-600">AWS & Azure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
