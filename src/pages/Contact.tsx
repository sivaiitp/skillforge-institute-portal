
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { data: settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instituteName = settings?.institute_name || 'RaceCodingInstitute';
  const institutePhone = settings?.institute_phone || '+91 98765 43210';
  const instituteEmail = settings?.institute_email || 'info@racecodinginstitute.edu';
  const instituteAddress = settings?.institute_address || '123 Tech Park, Sector 5\nBangalore, Karnataka 560001';
  const officeHours = settings?.office_hours || 'Mon - Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([formData]);

      if (error) throw error;

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`
          }}
        ></div>
        <div className="w-full max-w-[85%] mx-auto px-4 text-center relative z-10">
          <MessageSquare className="mx-auto h-16 w-16 mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions about our courses or need guidance? We're here to help you start your learning journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="w-full max-w-[85%] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">{instituteEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Phone className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">{institutePhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-gray-600 whitespace-pre-line">{instituteAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Clock className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold">Office Hours</p>
                      <p className="text-gray-600 whitespace-pre-line">{officeHours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visit Our Campus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Campus Map</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
