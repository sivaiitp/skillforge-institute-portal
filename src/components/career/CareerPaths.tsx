
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp } from "lucide-react";
import { useState } from "react";
import CareerRoadmapModal from "./CareerRoadmapModal";

const CareerPaths = () => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const careerPaths = [
    {
      title: "Software Developer",
      description: "Build applications and systems using modern programming languages",
      skills: ["JavaScript", "Python", "React", "Node.js"],
      avgSalary: "₹6-15 LPA",
      growth: "High",
      courses: ["Full Stack Web Development", "Mobile App Development"]
    },
    {
      title: "Data Scientist",
      description: "Analyze data to extract insights and build predictive models",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      avgSalary: "₹8-20 LPA",
      growth: "Very High",
      courses: ["Data Science with Python", "Machine Learning"]
    },
    {
      title: "Cloud Architect",
      description: "Design and manage cloud infrastructure and services",
      skills: ["AWS", "Azure", "DevOps", "Kubernetes"],
      avgSalary: "₹12-25 LPA",
      growth: "High",
      courses: ["Cloud Computing with AWS", "DevOps Engineering"]
    },
    {
      title: "Digital Marketing Specialist",
      description: "Drive online marketing campaigns and digital growth",
      skills: ["SEO", "SEM", "Analytics", "Content Marketing"],
      avgSalary: "₹4-12 LPA",
      growth: "High",
      courses: ["Digital Marketing", "Social Media Marketing"]
    }
  ];

  const handleGetRoadmap = (careerTitle: string) => {
    setSelectedCareer(careerTitle);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Popular Career Paths
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore high-demand tech careers and understand the skills and courses needed to get there.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {careerPaths.map((path, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {path.growth} Growth
                  </Badge>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp size={16} />
                    <span className="font-semibold">{path.avgSalary}</span>
                  </div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase size={20} />
                  {path.title}
                </CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommended Courses:</h4>
                  <ul className="text-sm text-gray-600">
                    {path.courses.map((course, courseIndex) => (
                      <li key={courseIndex}>• {course}</li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleGetRoadmap(path.title)}
                >
                  Get Career Roadmap
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CareerRoadmapModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        careerPath={selectedCareer || ""}
      />
    </section>
  );
};

export default CareerPaths;
