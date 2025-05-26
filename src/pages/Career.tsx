
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CareerHero from "@/components/career/CareerHero";
import CareerServices from "@/components/career/CareerServices";
import CareerPaths from "@/components/career/CareerPaths";
import CareerCTA from "@/components/career/CareerCTA";

const Career = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <CareerHero />
      <CareerServices />
      <CareerPaths />
      <CareerCTA />
      <Footer />
    </div>
  );
};

export default Career;
