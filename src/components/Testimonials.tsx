
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useTestimonials } from "@/hooks/useSiteSettings";

const Testimonials = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What Our Students Say
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Quote className="h-6 w-6 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What Our Students Say
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful graduates who have transformed their careers with us
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials?.map((testimonial, index) => (
            <Card key={testimonial.id} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm hover:bg-white transform hover:-translate-y-2">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                {/* Video or Text Content */}
                {testimonial.video_url ? (
                  <div className="mb-6 relative group/video">
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 aspect-video">
                      <iframe
                        src={testimonial.video_url}
                        className="w-full h-full"
                        allowFullScreen
                        title={`${testimonial.name} testimonial`}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-gray-800 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <blockquote className="text-gray-700 mb-6 text-base leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                )}
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2 font-medium">({testimonial.rating || 5}.0)</span>
                </div>
                
                {/* Profile */}
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={testimonial.image_url || `https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="ml-3">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 font-medium text-sm">
                      {testimonial.role}
                      {testimonial.company && (
                        <>
                          <span className="text-gray-400 mx-1">at</span>
                          <span className="text-blue-600 font-semibold">{testimonial.company}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to join our success stories?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Take the first step towards your dream career. Our expert team is here to guide you every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/courses"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Start Your Journey
                <Quote className="ml-3 h-4 w-4" />
              </Link>
              
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Free Consultation
                <Star className="ml-3 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
