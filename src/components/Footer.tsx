
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: settings } = useSiteSettings();

  const instituteName = settings?.institute_name || 'RaceCodingInstitute';
  const institutePhone = settings?.institute_phone || '+1 (555) 123-4567';
  const instituteEmail = settings?.institute_email || 'info@racecodinginstitute.com';
  const instituteAddress = settings?.institute_address || '123 Training Street, Tech City, TC 12345';
  const facebookUrl = settings?.facebook_url || '#';
  const twitterUrl = settings?.twitter_url || '#';
  const instagramUrl = settings?.instagram_url || '#';
  const linkedinUrl = settings?.linkedin_url || '#';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="w-full max-w-[85%] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">{instituteName}</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering careers through comprehensive training programs in technology, data science, and digital innovation.
            </p>
            <div className="flex space-x-4">
              <a href={facebookUrl} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={twitterUrl} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={instagramUrl} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={linkedinUrl} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">Courses</Link>
              <Link to="/events" className="block text-gray-400 hover:text-white transition-colors">Events</Link>
              <Link to="/career" className="block text-gray-400 hover:text-white transition-colors">Career Guidance</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-3">
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">Web Development</Link>
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">Data Science</Link>
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">Mobile Development</Link>
              <Link to="/courses" className="block text-gray-400 hover:text-white transition-colors">Digital Marketing</Link>
              <Link to="/verify-certificate" className="block text-gray-400 hover:text-white transition-colors">Certificate Verification</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400 whitespace-pre-line">{instituteAddress}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">{institutePhone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">{instituteEmail}</span>
              </div>
            </div>
            <Link 
              to="/contact" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 {instituteName}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
