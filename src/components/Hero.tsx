
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHomepageContent, useSiteSettings } from "@/hooks/useSiteSettings";
import HeroContent from "@/components/hero/HeroContent";
import HeroImage from "@/components/hero/HeroImage";
import HeroStats from "@/components/hero/HeroStats";

const Hero = () => {
  const navigate = useNavigate();
  const { data: homepageContent } = useHomepageContent();
  const { data: settings } = useSiteSettings();

  // Get hero content or fallback to defaults
  const heroContent = homepageContent?.find(item => item.section === 'hero');
  const statsContent = homepageContent?.filter(item => item.section.startsWith('stats_'));

  const title = heroContent?.title || "Transform Your Career with Professional Training";
  const description = heroContent?.description || "Join thousands of successful professionals who have advanced their careers through our comprehensive training programs in technology, data science, and digital marketing.";
  const buttonText = heroContent?.button_text || "Explore Courses";
  const buttonLink = heroContent?.button_link || "/courses";

  // Get stats data
  const coursesCount = statsContent?.find(item => item.section === 'stats_courses')?.title || "50+";
  const studentsCount = statsContent?.find(item => item.section === 'stats_students')?.title || "500+";
  const placementRate = statsContent?.find(item => item.section === 'stats_placement')?.title || "95%";

  const features = [
    "Industry-Expert Instructors",
    "Hands-on Projects",
    "Job Placement Support",
    "Flexible Learning Schedule"
  ];

  return (
    <section className="relative pt-6 pb-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-[80vh] flex items-center">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="w-full max-w-[85%] mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <HeroContent 
              title={title}
              description={description}
              buttonText={buttonText}
              buttonLink={buttonLink}
              features={features}
              navigate={navigate}
            />
            
            <HeroStats 
              coursesCount={coursesCount}
              studentsCount={studentsCount}
              placementRate={placementRate}
            />
          </div>

          {/* Right Content - Hero Image */}
          <div className="lg:col-span-5 relative">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
