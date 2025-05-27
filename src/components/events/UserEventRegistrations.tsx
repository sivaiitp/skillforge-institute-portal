
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const UserEventRegistrations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['my-event-registrations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            title,
            description,
            event_date,
            location,
            duration,
            registration_fee,
            max_participants,
            current_participants
          )
        `)
        .eq('user_id', user.id)
        .order('registration_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const cancelRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: 'cancelled' })
        .eq('id', registrationId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Registration Cancelled",
        description: "Your event registration has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['my-event-registrations'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to cancel registration. Please try again.",
        variant: "destructive",
      });
      console.error('Cancel registration error:', error);
    }
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading your registrations...</div>;
  }

  if (!registrations || registrations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Event Registrations</h3>
          <p className="text-gray-500">You haven't registered for any events yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Event Registrations</h2>
      
      <div className="grid gap-6">
        {registrations.map((registration) => {
          const event = registration.events;
          const eventDate = new Date(event.event_date);
          const isPastEvent = eventDate < new Date();
          const canCancel = !isPastEvent && registration.status !== 'cancelled';
          
          return (
            <Card key={registration.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={
                      registration.status === 'confirmed' ? 'default' :
                      registration.status === 'waitlist' ? 'secondary' :
                      'destructive'
                    }>
                      {registration.status}
                    </Badge>
                    {registration.payment_status && (
                      <Badge variant={
                        registration.payment_status === 'paid' ? 'default' :
                        registration.payment_status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {registration.payment_status}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-blue-600" />
                    {format(eventDate, 'PPP')}
                  </div>
                  {event.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={16} className="text-blue-600" />
                      {event.duration}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-blue-600" />
                      {event.location}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-blue-600" />
                    {event.current_participants}/{event.max_participants || '∞'}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Registered: {format(new Date(registration.registration_date), 'PPp')}
                    {registration.payment_amount > 0 && (
                      <span className="ml-4">Fee: ₹{registration.payment_amount}</span>
                    )}
                  </div>
                  
                  {canCancel && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelRegistrationMutation.mutate(registration.id)}
                      disabled={cancelRegistrationMutation.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>

                {registration.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm"><strong>Notes:</strong> {registration.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserEventRegistrations;
