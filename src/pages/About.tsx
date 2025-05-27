
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { useAboutContent, useFacultyMembers, useSiteSettings } from "@/hooks/useSiteSettings";

const About = () => {
  const { data: aboutContent, isLoading: aboutLoading } = useAboutContent();
  const { data: facultyMembers, isLoading: facultyLoading } = useFacultyMembers();
  const { data: settings } = useSiteSettings();

  const missionContent = aboutContent?.find(item => item.section === 'mission');
  const visionContent = aboutContent?.find(item => item.section === 'vision');
  const instituteName = settings?.institute_name || 'RaceCodingInstitute';

  const affiliations = [
    "Google Developer Partner",
    "Microsoft Learning Partner",
    "AWS Training Partner",
    "Meta Technology Partner"
  ];

  if (aboutLoading || facultyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="w-full max-w-[85%] mx-auto px-4 text-center relative z-10">
          <Users className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About {instituteName}</h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Transforming careers through world-class technology education and industry-focused training programs.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">
                  {missionContent?.title || 'Our Mission'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {missionContent?.content || 'To provide accessible, high-quality technology education that empowers individuals to build successful careers in the digital age.'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-600">
                  {visionContent?.title || 'Our Vision'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {visionContent?.content || 'To be the leading technology training institute that shapes the future workforce by creating skilled professionals who drive innovation and technological advancement across industries worldwide.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our Expert Faculty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn from industry veterans with years of real-world experience and proven expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers?.map((faculty, index) => (
              <Card key={faculty.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
                <CardContent className="p-6 text-center">
                  <img
                    src={faculty.image_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face`}
                    alt={faculty.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{faculty.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{faculty.role}</p>
                  {faculty.experience && (
                    <Badge variant="secondary" className="mb-4">
                      {faculty.experience}
                    </Badge>
                  )}
                  <p className="text-gray-600 text-sm leading-relaxed">{faculty.specialization}</p>
                  {faculty.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mt-2">{faculty.bio}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Affiliations */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
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
