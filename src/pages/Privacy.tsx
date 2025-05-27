
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  We collect information you provide directly to us, such as when you create an account, enroll in courses, 
                  or contact us for support. This may include your name, email address, phone number, and educational background.
                </p>
                <p className="text-gray-700">
                  We also automatically collect certain information about your device and how you interact with our platform, 
                  including your IP address, browser type, and usage patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide, maintain, and improve our educational services</li>
                  <li>Process enrollments and manage your account</li>
                  <li>Send you course updates and educational content</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except as described in this policy. We may share information with trusted service providers who assist us in 
                  operating our platform, conducting our business, or serving our users.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
                  storage is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="text-gray-700 mt-2">
                  Email: privacy@racecodinginstitute.com<br/>
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

export default Privacy;
