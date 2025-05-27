
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useTestimonials } from "@/hooks/useSiteSettings";

const Testimonials = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of successful graduates who have transformed their careers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-blue-600 mb-4" />
                </div>
                
                {testimonial.video_url ? (
                  <div className="mb-6">
                    <iframe
                      src={testimonial.video_url}
                      className="w-full h-48 rounded-lg"
                      allowFullScreen
                      title={`${testimonial.name} testimonial`}
                    />
                  </div>
                ) : (
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                )}
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <div className="flex items-center">
                  <img 
                    src={testimonial.image_url || `https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80`} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to join our success stories?</p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/courses"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 inline-block"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg transition-all duration-300 inline-block"
            >
              Get Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
