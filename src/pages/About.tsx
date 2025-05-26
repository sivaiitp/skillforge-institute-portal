
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = () => {
  const facultyMembers = [
    {
      name: "Dr. John Smith",
      role: "Head of Web Development",
      experience: "15+ years",
      specialization: "Full Stack Development, React, Node.js",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Sarah Wilson",
      role: "Data Science Lead",
      experience: "12+ years",
      specialization: "Machine Learning, Python, AI",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Mike Johnson",
      role: "Mobile Development Expert",
      experience: "10+ years",
      specialization: "React Native, Flutter, iOS/Android",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const affiliations = [
    "Google Developer Partner",
    "Microsoft Learning Partner",
    "AWS Training Partner",
    "Meta Technology Partner"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RaceCodingInstitute</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Transforming careers through world-class technology education and industry-focused training programs.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To provide accessible, high-quality technology education that empowers individuals 
                  to build successful careers in the digital age. We bridge the gap between academic 
                  learning and industry requirements through practical, hands-on training.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading technology training institute that shapes the future workforce 
                  by creating skilled professionals who drive innovation and technological advancement 
                  across industries worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry veterans with years of real-world experience and proven expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                <CardContent className="p-6 text-center">
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{faculty.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{faculty.role}</p>
                  <Badge variant="secondary" className="mb-4">
                    {faculty.experience}
                  </Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">{faculty.specialization}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Affiliations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Industry Affiliations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proud partners with leading technology companies and educational organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {affiliations.map((affiliation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">★</span>
                  </div>
                  <p className="font-semibold text-gray-800">{affiliation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
