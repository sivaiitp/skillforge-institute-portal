
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users, CreditCard } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  duration: string;
  registration_fee: number;
  max_participants: number;
  current_participants: number;
}

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onRegistrationSuccess: () => void;
}

const EventRegistrationModal = ({ isOpen, onClose, event, onRegistrationSuccess }: EventRegistrationModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  if (!event) return null;

  const isEventFull = event.current_participants >= event.max_participants;
  const spotsAvailable = event.max_participants - event.current_participants;

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to register for events.",
          variant: "destructive",
        });
        return;
      }

      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .single();

      if (existingRegistration) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
          variant: "destructive",
        });
        return;
      }

      const status = isEventFull ? 'waitlist' : 'confirmed';
      
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          status,
          payment_amount: event.registration_fee,
          notes: notes.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: status === 'waitlist' 
          ? "You've been added to the waitlist. We'll notify you if a spot opens up."
          : "You've successfully registered for the event.",
      });

      onRegistrationSuccess();
      onClose();
      setNotes("");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            Register for Event
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">{event.title}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                {format(new Date(event.event_date), 'PPP')}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                {event.duration}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                {spotsAvailable > 0 ? `${spotsAvailable} spots available` : 'Event Full - Join Waitlist'}
              </div>
              {event.registration_fee > 0 && (
                <div className="flex items-center gap-2 col-span-2">
                  <CreditCard size={16} className="text-blue-600" />
                  Registration Fee: ₹{event.registration_fee}
                </div>
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes..."
                className="mt-1"
              />
            </div>

            {isEventFull && (
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <p className="text-orange-800 text-sm">
                  This event is currently full. You will be added to the waitlist and notified if a spot becomes available.
                </p>
              </div>
            )}

            {event.registration_fee > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm">
                  Payment will be processed after registration confirmation. You will receive payment instructions via email.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : isEventFull ? "Join Waitlist" : "Register Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
