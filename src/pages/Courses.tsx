import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      description: "Complete web development program covering frontend and backend technologies.",
      duration: "6 months",
      students: "250+",
      rating: "4.9",
      price: "₹15,000",
      tags: ["React", "Node.js", "MongoDB", "Express"],
      level: "Beginner to Advanced",
      syllabus: ["HTML/CSS/JavaScript", "React.js", "Node.js & Express", "MongoDB", "Project Development"],
      certification: "Industry Recognized Certificate",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Data Science & Machine Learning",
      description: "Comprehensive data science program with hands-on ML projects.",
      duration: "8 months",
      students: "180+",
      rating: "4.8",
      price: "₹12,000",
      tags: ["Python", "ML", "AI", "Statistics"],
      level: "Intermediate",
      syllabus: ["Python Programming", "Statistics", "Machine Learning", "Deep Learning", "Real-world Projects"],
      certification: "Data Science Professional Certificate",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile applications.",
      duration: "5 months",
      students: "120+",
      rating: "4.7",
      price: "₹14,000",
      tags: ["React Native", "Flutter", "iOS", "Android"],
      level: "Beginner",
      syllabus: ["Mobile UI/UX", "React Native", "Flutter", "API Integration", "App Store Deployment"],
      certification: "Mobile Developer Certificate",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Cloud Computing & DevOps",
      description: "Master cloud platforms and DevOps practices for modern development.",
      duration: "4 months",
      students: "95+",
      rating: "4.6",
      price: "₹10,000",
      tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      level: "Intermediate",
      syllabus: ["Cloud Fundamentals", "AWS Services", "Docker & Containers", "Kubernetes", "CI/CD Pipelines"],
      certification: "Cloud & DevOps Certificate",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Cybersecurity Fundamentals",
      description: "Essential cybersecurity skills for protecting digital assets.",
      duration: "3 months",
      students: "150+",
      rating: "4.5",
      price: "₹8,000",
      tags: ["Security", "Ethical Hacking", "Network Security"],
      level: "Beginner to Intermediate",
      syllabus: ["Security Basics", "Network Security", "Ethical Hacking", "Risk Management", "Compliance"],
      certification: "Cybersecurity Professional Certificate",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "UI/UX Design Mastery",
      description: "Create stunning user interfaces and exceptional user experiences.",
      duration: "4 months",
      students: "200+",
      rating: "4.8",
      price: "₹9,500",
      tags: ["Figma", "Design Systems", "Prototyping"],
      level: "Beginner",
      syllabus: ["Design Principles", "Figma", "User Research", "Prototyping", "Design Systems"],
      certification: "UI/UX Design Certificate",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Training Programs</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive courses designed to transform your career and master in-demand technologies.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                      {course.price}
                    </span>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <BookOpen size={16} />
                      Syllabus Overview
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.syllabus.slice(0, 3).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          {item}
                        </li>
                      ))}
                      {course.syllabus.length > 3 && (
                        <li className="text-blue-600 text-xs">+ More topics...</li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {course.certification}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Not Sure Which Course to Choose?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take our free career assessment to find the perfect program for your goals.
          </p>
          <Button size="lg" variant="secondary" className="text-blue-600 hover:bg-gray-100">
            Take Free Assessment
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
