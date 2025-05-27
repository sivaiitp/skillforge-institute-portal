
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Book, Target } from "lucide-react";

interface CareerRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerPath: string;
}

const CareerRoadmapModal = ({ isOpen, onClose, careerPath }: CareerRoadmapModalProps) => {
  const roadmaps = {
    "Software Developer": {
      duration: "6-8 months",
      phases: [
        {
          title: "Foundation Phase (Month 1-2)",
          skills: ["HTML", "CSS", "JavaScript Basics", "Git/GitHub"],
          description: "Build strong fundamentals in web technologies"
        },
        {
          title: "Frontend Development (Month 3-4)",
          skills: ["React", "Component Design", "State Management", "Responsive Design"],
          description: "Master modern frontend frameworks and tools"
        },
        {
          title: "Backend Development (Month 5-6)",
          skills: ["Node.js", "Express", "Databases", "API Design"],
          description: "Learn server-side development and database management"
        },
        {
          title: "Advanced Topics (Month 7-8)",
          skills: ["Testing", "Deployment", "Performance", "Security"],
          description: "Professional development practices and optimization"
        }
      ]
    },
    "Data Scientist": {
      duration: "8-10 months",
      phases: [
        {
          title: "Programming Foundation (Month 1-2)",
          skills: ["Python", "Pandas", "NumPy", "Jupyter Notebooks"],
          description: "Master Python for data manipulation and analysis"
        },
        {
          title: "Statistics & Math (Month 3-4)",
          skills: ["Statistics", "Linear Algebra", "Probability", "Data Visualization"],
          description: "Build mathematical foundation for data science"
        },
        {
          title: "Machine Learning (Month 5-7)",
          skills: ["Scikit-learn", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"],
          description: "Learn core machine learning algorithms and techniques"
        },
        {
          title: "Advanced ML & Deployment (Month 8-10)",
          skills: ["Deep Learning", "TensorFlow", "MLOps", "Cloud Platforms"],
          description: "Advanced techniques and production deployment"
        }
      ]
    },
    "Cloud Architect": {
      duration: "6-9 months",
      phases: [
        {
          title: "Cloud Fundamentals (Month 1-2)",
          skills: ["AWS Basics", "Networking", "Security", "Cost Management"],
          description: "Understand cloud computing principles and AWS basics"
        },
        {
          title: "Infrastructure as Code (Month 3-4)",
          skills: ["Terraform", "CloudFormation", "CI/CD", "Version Control"],
          description: "Automate infrastructure deployment and management"
        },
        {
          title: "Container Technologies (Month 5-6)",
          skills: ["Docker", "Kubernetes", "Container Orchestration", "Microservices"],
          description: "Master containerization and orchestration"
        },
        {
          title: "Advanced Architecture (Month 7-9)",
          skills: ["Multi-cloud", "Serverless", "Monitoring", "Disaster Recovery"],
          description: "Design scalable and resilient cloud architectures"
        }
      ]
    },
    "Digital Marketing Specialist": {
      duration: "4-6 months",
      phases: [
        {
          title: "Digital Marketing Foundation (Month 1-2)",
          skills: ["SEO Basics", "Content Marketing", "Social Media", "Analytics"],
          description: "Build core digital marketing knowledge"
        },
        {
          title: "Paid Advertising (Month 3-4)",
          skills: ["Google Ads", "Facebook Ads", "PPC Campaigns", "Conversion Optimization"],
          description: "Master paid advertising platforms and strategies"
        },
        {
          title: "Advanced Analytics (Month 5-6)",
          skills: ["Google Analytics", "Data Analysis", "A/B Testing", "Marketing Automation"],
          description: "Advanced analytics and optimization techniques"
        }
      ]
    }
  };

  const roadmap = roadmaps[careerPath as keyof typeof roadmaps];

  if (!roadmap) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">
            {careerPath} Learning Roadmap
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <Clock className="text-blue-600" size={24} />
            <div>
              <h3 className="font-semibold">Total Duration</h3>
              <p className="text-gray-600">{roadmap.duration}</p>
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.phases.map((phase, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{phase.title}</h3>
                    <p className="text-gray-600 mb-4">{phase.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Target size={16} />
                        Key Skills to Learn:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <CheckCircle className="text-green-500" size={20} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={onClose}
            >
              <Book className="mr-2" size={16} />
              Start Learning Journey
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Download Roadmap
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerRoadmapModal;
