
import { AssessmentResults as ResultsType } from "@/types/assessmentTypes";
import { UserPreferences } from "./AssessmentPreferences";
import { generatePersonalizedRoadmap } from "@/utils/roadmapGenerator";
import { getRecommendedCourses } from "@/utils/courseRecommendations";
import ScoresOverview from "./results/ScoresOverview";
import RoadmapDisplay from "./results/RoadmapDisplay";
import CourseRecommendations from "./results/CourseRecommendations";

interface PersonalizedResultsProps {
  results: ResultsType;
  preferences: UserPreferences;
}

const PersonalizedResults = ({ results, preferences }: PersonalizedResultsProps) => {
  const roadmap = generatePersonalizedRoadmap(preferences, results);
  const recommendedCourses = getRecommendedCourses(preferences, results);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Personalized Results
        </h1>
        <p className="text-xl text-gray-600">Tailored for {preferences.specialization} • {roadmap.difficultyLevel} Level</p>
      </div>

      <ScoresOverview 
        results={results}
        preferences={preferences}
        roadmap={roadmap}
      />

      <RoadmapDisplay 
        preferences={preferences}
        roadmap={roadmap}
      />

      <CourseRecommendations 
        results={results}
        preferences={preferences}
        roadmap={roadmap}
        recommendedCourses={recommendedCourses}
      />
    </div>
  );
};

export default PersonalizedResults;
