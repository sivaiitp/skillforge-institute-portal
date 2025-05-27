
interface Certificate {
  id: string;
  certificate_number: string;
  issued_date: string;
  is_valid: boolean;
  user_id: string;
  course_id: string;
  courses: {
    title: string;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

export const downloadCertificateAsPDF = (certificate: Certificate) => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to download the certificate');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Certificate - ${certificate.profiles.full_name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          margin: 0;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .certificate {
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 3px solid #d4af37;
          border-radius: 15px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        
        .certificate::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border: 2px solid #d4af37;
          border-radius: 10px;
          opacity: 0.6;
        }
        
        .certificate::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
          z-index: 1;
        }
        
        .content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .institute-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: bold;
          font-family: 'Playfair Display', serif;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .institute-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 5px;
          letter-spacing: 1px;
        }
        
        .institute-tagline {
          font-size: 12px;
          color: #64748b;
          font-weight: 400;
          letter-spacing: 0.5px;
        }
        
        .certificate-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #2c3e50;
          margin: 25px 0 15px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .achievement-text {
          text-align: center;
          margin: 20px 0;
        }
        
        .achievement-label {
          font-size: 16px;
          color: #64748b;
          margin-bottom: 10px;
          font-weight: 400;
        }
        
        .recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          margin: 15px 0;
          padding: 10px 20px;
          border-bottom: 3px solid #d4af37;
          display: inline-block;
        }
        
        .completion-text {
          font-size: 16px;
          color: #64748b;
          margin: 15px 0 10px;
        }
        
        .course-name {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 600;
          color: #667eea;
          margin: 10px 0 25px;
          text-align: center;
        }
        
        .details-section {
          display: flex;
          justify-content: space-around;
          margin: 25px 0;
          padding: 20px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-item {
          text-align: center;
          flex: 1;
        }
        
        .detail-label {
          font-weight: 600;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        
        .detail-value {
          color: #1f2937;
          font-size: 14px;
          font-weight: 500;
        }
        
        .certificate-id {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #6b7280;
        }
        
        .status-valid {
          color: #059669;
          font-weight: 600;
        }
        
        .status-revoked {
          color: #dc2626;
          font-weight: 600;
        }
        
        .footer {
          text-align: center;
          margin-top: auto;
        }
        
        .signature-line {
          width: 200px;
          height: 1px;
          background: #d1d5db;
          margin: 20px auto 10px;
        }
        
        .signature-title {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .verification-note {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 15px;
          line-height: 1.4;
        }
        
        .decorative-element {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 2px solid #d4af37;
          border-radius: 50%;
          opacity: 0.1;
        }
        
        .decorative-element.top-left {
          top: -50px;
          left: -50px;
        }
        
        .decorative-element.bottom-right {
          bottom: -50px;
          right: -50px;
        }
        
        @media print {
          body { 
            background: white; 
            padding: 0; 
            min-height: auto;
          }
          .certificate { 
            box-shadow: none; 
            border-radius: 0;
            width: 100%;
            height: auto;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="decorative-element top-left"></div>
        <div class="decorative-element bottom-right"></div>
        
        <div class="content">
          <div class="header">
            <div class="institute-logo">RC</div>
            <div class="institute-name">RaceCoding Institute</div>
            <div class="institute-tagline">Excellence in Digital Education</div>
          </div>
          
          <div class="certificate-title">Certificate of Completion</div>
          
          <div class="achievement-text">
            <div class="achievement-label">This certifies that</div>
            <div class="recipient-name">${certificate.profiles.full_name}</div>
            <div class="completion-text">has successfully completed the course</div>
            <div class="course-name">${certificate.courses.title}</div>
          </div>
          
          <div class="details-section">
            <div class="detail-item">
              <div class="detail-label">Date Issued</div>
              <div class="detail-value">${new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Certificate ID</div>
              <div class="detail-value certificate-id">${certificate.certificate_number}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value ${certificate.is_valid ? 'status-valid' : 'status-revoked'}">
                ${certificate.is_valid ? 'Valid' : 'Revoked'}
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="signature-line"></div>
            <div class="signature-title">Authorized Signature</div>
            <div class="verification-note">
              This certificate can be verified at our official website using Certificate ID: ${certificate.certificate_number}<br>
              Issued by RaceCoding Institute | Digital Learning Excellence
            </div>
          </div>
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

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
