
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Clock, Plus, Edit, Trash2, Download } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EventManagement = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    duration: '',
    max_participants: '',
    registration_fee: '0'
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchEvents();
  }, [user, userRole, navigate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      toast.error('Error fetching events');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const fetchEventRegistrations = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          profiles!event_registrations_user_id_fkey (
            full_name,
            email,
            phone
          )
        `)
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      toast.error('Error fetching registrations');
      console.error('Error:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!formData.title || !formData.event_date) {
        toast.error('Please fill in required fields');
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location,
          duration: formData.duration,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          registration_fee: parseFloat(formData.registration_fee) || 0
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Event created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error:', error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location,
          duration: formData.duration,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          registration_fee: parseFloat(formData.registration_fee) || 0
        })
        .eq('id', selectedEvent.id);

      if (error) throw error;

      toast.success('Event updated successfully');
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      toast.error('Error updating event');
      console.error('Error:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This will also delete all registrations.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Error deleting event');
      console.error('Error:', error);
    }
  };

  const handleToggleEventStatus = async (eventId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      toast.success(`Event ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchEvents();
    } catch (error) {
      toast.error('Error updating event status');
      console.error('Error:', error);
    }
  };

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    fetchEventRegistrations(event.id);
    setIsRegistrationsModalOpen(true);
  };

  const handleUpdateRegistrationStatus = async (registrationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;

      toast.success('Registration status updated');
      fetchEventRegistrations(selectedEvent.id);
      fetchEvents(); // Refresh to update participant counts
    } catch (error) {
      toast.error('Error updating registration status');
      console.error('Error:', error);
    }
  };

  const exportRegistrations = () => {
    if (!registrations.length) {
      toast.error('No registrations to export');
      return;
    }

    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Registration Date', 'Payment Status'],
      ...registrations.map(reg => [
        reg.profiles?.full_name || 'N/A',
        reg.profiles?.email || 'N/A',
        reg.profiles?.phone || 'N/A',
        reg.status,
        format(new Date(reg.registration_date), 'PPP'),
        reg.payment_status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEvent?.title}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      duration: '',
      max_participants: '',
      registration_fee: '0'
    });
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm") : '',
      location: event.location || '',
      duration: event.duration || '',
      max_participants: event.max_participants?.toString() || '',
      registration_fee: event.registration_fee?.toString() || '0'
    });
    setIsEditModalOpen(true);
  };

  if (!user || userRole !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Event Management</h1>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Fill in the details for the new event
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Event Description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <Input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                  <Input
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                  <Input
                    placeholder="Duration (e.g., 2 hours)"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max Participants (optional)"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Registration Fee"
                    value={formData.registration_fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_fee: e.target.value }))}
                  />
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No Events Created</h3>
                    <p className="text-gray-600 mb-4">Create your first event to get started</p>
                  </CardContent>
                </Card>
              ) : (
                events.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {event.title}
                            <Badge variant={event.is_active ? "default" : "secondary"}>
                              {event.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{event.description}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleEventStatus(event.id, event.is_active)}
                          >
                            {event.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.event_date), 'PPP p')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                        )}
                        {event.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {event.duration}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          {event.current_participants || 0}
                          {event.max_participants && ` / ${event.max_participants}`} participants
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleViewRegistrations(event)}
                        >
                          View Registrations ({event.current_participants || 0})
                        </Button>
                        {event.registration_fee > 0 && (
                          <Badge variant="secondary">
                            Fee: ₹{event.registration_fee}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Edit Event Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>
                  Update the event details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  type="datetime-local"
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                />
                <Input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                <Input
                  placeholder="Duration (e.g., 2 hours)"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max Participants (optional)"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Registration Fee"
                  value={formData.registration_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration_fee: e.target.value }))}
                />
                <Button onClick={handleUpdateEvent}>Update Event</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Registrations Modal */}
          <Dialog open={isRegistrationsModalOpen} onOpenChange={setIsRegistrationsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Event Registrations - {selectedEvent?.title}</DialogTitle>
                <DialogDescription>
                  Manage registrations for this event
                </DialogDescription>
                <Button onClick={exportRegistrations} size="sm" className="w-fit">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </DialogHeader>
              <div className="py-4">
                {registrations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No registrations yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.profiles?.full_name || 'N/A'}</TableCell>
                          <TableCell>{registration.profiles?.email || 'N/A'}</TableCell>
                          <TableCell>{registration.profiles?.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              registration.status === 'confirmed' ? 'default' :
                              registration.status === 'waitlist' ? 'secondary' : 'destructive'
                            }>
                              {registration.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(registration.registration_date), 'PPP')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              registration.payment_status === 'paid' ? 'default' :
                              registration.payment_status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {registration.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {registration.status !== 'confirmed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateRegistrationStatus(registration.id, 'confirmed')}
                                >
                                  Confirm
                                </Button>
                              )}
                              {registration.status !== 'waitlist' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateRegistrationStatus(registration.id, 'waitlist')}
                                >
                                  Waitlist
                                </Button>
                              )}
                              {registration.status !== 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleUpdateRegistrationStatus(registration.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
