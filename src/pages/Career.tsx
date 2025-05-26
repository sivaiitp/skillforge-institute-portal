import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Users, Award, BookOpen, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Career = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Career Guidance & Planning
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Navigate your tech career with expert guidance. Discover career paths, assess your skills, and create a roadmap to success.
          </p>
        </div>
      </section>

      {/* Career Guidance Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
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

      {/* Career Paths */}
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
                    onClick={() => navigate('/contact')}
                  >
                    Get Career Roadmap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      <Footer />
    </div>
  );
};

export default Career;
