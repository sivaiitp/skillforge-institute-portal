
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users, Award } from "lucide-react";

const CareerServices = () => {
  const services = [
    {
      icon: <BookOpen className="text-blue-600" size={24} />,
      title: "Skill Assessment",
      description: "Evaluate your current skills and identify areas for improvement"
    },
    {
      icon: <Target className="text-blue-600" size={24} />,
      title: "Career Roadmap",
      description: "Get a personalized learning path to reach your career goals"
    },
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: "Mentorship",
      description: "Connect with industry experts for guidance and support"
    },
    {
      icon: <Award className="text-blue-600" size={24} />,
      title: "Certification Guidance",
      description: "Choose the right certifications to boost your career prospects"
    }
  ];

  return (
    <section className="py-20">
      <div className="w-full max-w-[85%] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Our Career Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive career support to help you make informed decisions and achieve your professional goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerServices;
