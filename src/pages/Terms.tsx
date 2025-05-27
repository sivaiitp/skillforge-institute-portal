
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Terms of Service</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  By accessing and using RaceCodingInstitute's platform, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Enrollment and Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  When you enroll in a course, you gain access to course materials for the duration specified in your enrollment. 
                  Course access may be revoked if terms are violated.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You must provide accurate and complete information during enrollment</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>Course materials are for personal use only and may not be shared</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment and Refunds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Payment is required upon enrollment unless otherwise specified. We offer a 30-day money-back guarantee 
                  for most courses, subject to certain conditions.
                </p>
                <p className="text-gray-700">
                  Refund requests must be submitted within 30 days of enrollment and before completing 25% of the course content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  All course content, including but not limited to text, graphics, logos, images, and software, is the property 
                  of RaceCodingInstitute and protected by copyright laws. You may not reproduce, distribute, or create derivative 
                  works from our content without explicit permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Conduct</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Share account credentials with others</li>
                  <li>Attempt to gain unauthorized access to any part of the platform</li>
                  <li>Upload or transmit malicious code or content</li>
                  <li>Harass or abuse other users or instructors</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  RaceCodingInstitute shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from 
                  your use of the platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We may terminate or suspend your account and access to the platform immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to 
                  provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  Email: legal@racecodinginstitute.com<br/>
                  Phone: +1 (555) 123-4567<br/>
                  Address: 123 Training Street, Tech City, TC 12345
                </p>
              </CardContent>
            </Card>

            <div className="text-center text-gray-600 mt-8">
              <p>Last updated: December 2024</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
