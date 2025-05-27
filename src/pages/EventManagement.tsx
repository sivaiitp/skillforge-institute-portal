
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Users, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const EventManagement = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedEventRegistrations, setSelectedEventRegistrations] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    duration: "",
    max_participants: "",
    registration_fee: ""
  });

  // Fetch events
  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch registrations for selected event
  const { data: registrations } = useQuery({
    queryKey: ['event-registrations', selectedEventRegistrations],
    queryFn: async () => {
      if (!selectedEventRegistrations) return [];
      
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .eq('event_id', selectedEventRegistrations)
        .order('registration_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEventRegistrations
  });

  // Create/Update event mutation
  const saveEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Event ${editingEvent ? 'updated' : 'created'} successfully.`,
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      });
      console.error('Save event error:', error);
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
      console.error('Delete event error:', error);
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      location: "",
      duration: "",
      max_participants: "",
      registration_fee: ""
    });
    setIsCreating(false);
    setEditingEvent(null);
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsCreating(true);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location || "",
      duration: event.duration || "",
      max_participants: event.max_participants?.toString() || "",
      registration_fee: event.registration_fee?.toString() || ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title: formData.title,
      description: formData.description || null,
      event_date: new Date(formData.event_date).toISOString(),
      location: formData.location || null,
      duration: formData.duration || null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : 0,
      is_active: true
    };

    saveEventMutation.mutate(eventData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Event Management</h1>
            <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2" size={16} />
              Create Event
            </Button>
          </div>

          {/* Create/Edit Event Form */}
          {isCreating && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="event_date">Event Date & Time *</Label>
                      <Input
                        id="event_date"
                        type="datetime-local"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g., 2 hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_participants">Max Participants</Label>
                      <Input
                        id="max_participants"
                        type="number"
                        value={formData.max_participants}
                        onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="registration_fee">Registration Fee (₹)</Label>
                      <Input
                        id="registration_fee"
                        type="number"
                        step="0.01"
                        value={formData.registration_fee}
                        onChange={(e) => setFormData({ ...formData, registration_fee: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={saveEventMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saveEventMutation.isPending ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage your events and view registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events?.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(event.event_date), 'PPp')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users size={12} />
                          {event.current_participants || 0}/{event.max_participants || '∞'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.registration_fee === 0 ? 'Free' : `₹${event.registration_fee}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant={event.is_active ? "default" : "secondary"}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEventRegistrations(event.id)}
                          >
                            <Users size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteEventMutation.mutate(event.id)}
                            disabled={deleteEventMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Registrations Modal/Section */}
          {selectedEventRegistrations && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Event Registrations</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedEventRegistrations(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations?.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.profiles?.full_name || 'N/A'}</TableCell>
                        <TableCell>{registration.profiles?.email || 'N/A'}</TableCell>
                        <TableCell>{registration.profiles?.phone || 'N/A'}</TableCell>
                        <TableCell>{format(new Date(registration.registration_date), 'PPp')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            registration.status === 'confirmed' ? 'default' :
                            registration.status === 'waitlist' ? 'secondary' : 'destructive'
                          }>
                            {registration.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            registration.payment_status === 'paid' ? 'default' :
                            registration.payment_status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {registration.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
