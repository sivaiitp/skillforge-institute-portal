
import { AssessmentResults } from "@/types/assessmentTypes";
import { UserPreferences } from "@/components/assessment/AssessmentPreferences";

interface RoadmapData {
  specialization: string;
  timeline: string;
  difficultyLevel: string;
  phases: Array<{
    title: string;
    duration: string;
    skills: string[];
  }>;
}

export const generatePDFContent = (
  results: AssessmentResults,
  preferences: UserPreferences,
  roadmap: RoadmapData,
  recommendedCourses: string[]
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Personalized Learning Roadmap - ${preferences.specialization}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap');
        
        body {
          margin: 0;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
          color: #1f2937;
          line-height: 1.6;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          padding: 32px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .institute-info {
          position: relative;
          z-index: 2;
          margin-bottom: 24px;
        }
        
        .institute-name {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .institute-tagline {
          font-size: 16px;
          opacity: 0.9;
          margin: 0 0 16px 0;
          font-weight: 300;
        }
        
        .institute-address {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
          font-weight: 400;
        }
        
        .document-title {
          position: relative;
          z-index: 2;
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          margin: 24px 0 0 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        
        .content {
          padding: 40px;
        }
        
        .assessment-summary {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
          border: 1px solid #93c5fd;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          text-align: center;
        }
        
        .summary-value {
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
          margin: 0 0 4px 0;
        }
        
        .summary-label {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        
        .user-details {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .user-details h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 14px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .detail-label {
          font-weight: 500;
          color: #6b7280;
        }
        
        .detail-value {
          font-weight: 600;
          color: #1f2937;
        }
        
        .section {
          margin: 32px 0;
        }
        
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 20px 0;
          padding-bottom: 8px;
          border-bottom: 3px solid #2563eb;
          display: inline-block;
        }
        
        .roadmap-phase {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin: 16px 0;
          position: relative;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        
        .phase-number {
          position: absolute;
          top: -12px;
          left: 24px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        
        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .phase-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .phase-duration {
          background: #dbeafe;
          color: #2563eb;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
          margin-top: 12px;
        }
        
        .skill-tag {
          background: #f0f9ff;
          color: #1e40af;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid #bfdbfe;
          text-align: center;
        }
        
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        
        .course-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          position: relative;
        }
        
        .course-title {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          font-size: 14px;
        }
        
        .course-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
        }
        
        .category-breakdown {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .category-name {
          font-weight: 500;
          color: #374151;
        }
        
        .category-score {
          font-weight: 600;
          color: #2563eb;
        }
        
        .footer {
          background: #f9fafb;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          margin-top: 40px;
        }
        
        .footer-text {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0;
        }
        
        .generated-date {
          font-weight: 500;
          color: #374151;
        }
        
        @media print {
          body { 
            background: white; 
            padding: 0; 
          }
          .container { 
            box-shadow: none; 
            max-width: none;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="institute-info">
            <h1 class="institute-name">RaceCoding Institute</h1>
            <p class="institute-tagline">Excellence in Digital Education & Professional Development</p>
            <div class="institute-address">
              123 Tech Innovation Hub, Silicon Valley Road, Digital City, TC 560001<br>
              Phone: +91-9876543210 | Email: info@racecoding.com | Web: www.racecoding.com
            </div>
          </div>
          <h2 class="document-title">Personalized Learning Roadmap</h2>
        </div>
        
        <div class="content">
          <div class="assessment-summary">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${results.percentage}%</div>
                <div class="summary-label">Overall Score</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${results.correctAnswers}/${results.totalQuestions}</div>
                <div class="summary-label">Questions Correct</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${roadmap.timeline}</div>
                <div class="summary-label">Recommended Timeline</div>
              </div>
            </div>
            
            <div class="user-details">
              <h3>Assessment Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Specialization:</span>
                  <span class="detail-value">${preferences.specialization}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Experience Level:</span>
                  <span class="detail-value">${preferences.experience}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Time Commitment:</span>
                  <span class="detail-value">${preferences.timeForInterview}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Difficulty Level:</span>
                  <span class="detail-value">${roadmap.difficultyLevel}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Learning Roadmap</h2>
            ${roadmap.phases.map((phase, index) => `
              <div class="roadmap-phase">
                <div class="phase-number">${index + 1}</div>
                <div class="phase-header">
                  <h3 class="phase-title">${phase.title}</h3>
                  <span class="phase-duration">${phase.duration}</span>
                </div>
                <div class="skills-grid">
                  ${phase.skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2 class="section-title">Recommended Courses</h2>
            <div class="courses-grid">
              ${recommendedCourses.map((course, index) => `
                <div class="course-card">
                  ${index === 0 ? '<div class="course-badge">Recommended</div>' : ''}
                  <h4 class="course-title">${course}</h4>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Performance Breakdown</h2>
            <div class="category-breakdown">
              ${Object.entries(results.categoryScores).map(([category, scores]) => `
                <div class="category-item">
                  <span class="category-name">${category}</span>
                  <span class="category-score">${scores.correct}/${scores.total} (${Math.round((scores.correct/scores.total)*100)}%)</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p class="footer-text generated-date">Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p class="footer-text">This personalized roadmap is designed to guide your learning journey.</p>
          <p class="footer-text">For support and guidance, contact us at support@racecoding.com</p>
          <p class="footer-text">© 2024 RaceCoding Institute. All rights reserved.</p>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 1000);
        };
      </script>
    </body>
    </html>
  `;
};
