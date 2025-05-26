
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BookOpen, Target } from 'lucide-react';

interface Course {
  detailed_description: string;
  learning_outcomes: string;
  prerequisites: string;
  title: string;
}

interface CourseContentProps {
  course: Course;
}

const CourseContent = ({ course }: CourseContentProps) => {
  // Parse learning outcomes or use default ones
  const learningOutcomes = course.learning_outcomes ? 
    course.learning_outcomes.split('\n').filter(item => item.trim()) : [
      'Master fundamental concepts and best practices',
      'Gain hands-on experience with real-world projects',
      'Develop industry-relevant skills and knowledge',
      'Build a strong foundation for career advancement',
      'Learn from expert instructors with industry experience',
      'Receive comprehensive study materials and resources',
      'Get certified upon successful completion'
    ];

  // Parse prerequisites or use default ones
  const prerequisites = course.prerequisites ? 
    course.prerequisites.split('\n').filter(item => item.trim()) : [
      'Basic computer literacy',
      'Passion for learning new technologies',
      'No prior experience required for beginner courses'
    ];

  return (
    <div className="lg:col-span-2 space-y-8">
      {/* What You'll Learn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{outcome}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Course Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {course.detailed_description ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {course.detailed_description}
              </div>
            ) : (
              <>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This comprehensive {course.title.toLowerCase()} program is designed to provide you with 
                  the skills and knowledge needed to excel in today's competitive market. Our expert 
                  instructors bring years of industry experience to deliver practical, hands-on training.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Throughout this course, you'll work on real-world projects that simulate actual 
                  industry challenges. This approach ensures that you not only learn the theoretical 
                  concepts but also gain practical experience that employers value.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upon successful completion, you'll receive an industry-recognized certificate that 
                  validates your skills and enhances your career prospects.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-700">
            {prerequisites.map((prerequisite, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {prerequisite}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseContent;
