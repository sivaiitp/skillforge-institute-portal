
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EventRegistrationModal from "@/components/events/EventRegistrationModal";
import { format } from "date-fns";
import { useState } from "react";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const { data: events, isLoading, refetch } = useQuery({
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

  const handleRegisterClick = (event: any) => {
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    refetch(); // Refresh events to update participant counts
  };

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
          ) : events && events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const spotsAvailable = event.max_participants ? event.max_participants - (event.current_participants || 0) : null;
                const isEventFull = spotsAvailable !== null && spotsAvailable <= 0;
                const eventDate = new Date(event.event_date);
                const isPastEvent = eventDate < new Date();
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {event.registration_fee === 0 ? 'Free' : `₹${event.registration_fee}`}
                        </Badge>
                        {event.max_participants && (
                          <Badge variant={isEventFull ? "destructive" : "outline"}>
                            {event.current_participants || 0}/{event.max_participants}
                          </Badge>
                        )}
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
                          {format(eventDate, 'PPP')}
                        </div>
                        {event.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} />
                            {event.duration}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={16} />
                            {event.location}
                          </div>
                        )}
                        {spotsAvailable !== null && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} />
                            {isEventFull ? 'Event Full' : `${spotsAvailable} spots available`}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className={`w-full ${isPastEvent ? 'bg-gray-400' : isEventFull ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        onClick={() => handleRegisterClick(event)}
                        disabled={isPastEvent}
                      >
                        {isPastEvent ? 'Event Ended' : isEventFull ? 'Join Waitlist' : 'Register Now'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No Events Available</h3>
              <p className="text-gray-500">Check back soon for upcoming events and workshops!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      <EventRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        event={selectedEvent}
        onRegistrationSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default Events;
