
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { format } from "date-fns";

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Upcoming Events & Workshops
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join our free workshops, expert talks, and networking events to enhance your skills and connect with industry professionals.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center">
              <p className="text-xl text-gray-600">Loading events...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events?.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {event.registration_fee === 0 ? 'Free' : `₹${event.registration_fee}`}
                      </Badge>
                      <Badge variant="outline">
                        {event.current_participants}/{event.max_participants}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        {format(new Date(event.event_date), 'PPP')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        {event.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        {event.max_participants - (event.current_participants || 0)} spots available
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
