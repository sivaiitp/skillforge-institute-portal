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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap');
        
        body {
          margin: 0;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .certificate {
          width: 1000px;
          height: 707px;
          background: white;
          position: relative;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
          border: 4px solid transparent;
          background: linear-gradient(white, white) padding-box,
                     linear-gradient(45deg, #dbeafe, #e0e7ff, #dbeafe) border-box;
          border-radius: 16px;
        }
        
        .inner-border {
          position: absolute;
          inset: 12px;
          border: 2px double #93c5fd;
          border-radius: 12px;
          pointer-events: none;
        }
        
        .gold-border {
          position: absolute;
          inset: 20px;
          border: 1px solid #d4af37;
          border-radius: 8px;
          opacity: 0.4;
          pointer-events: none;
        }
        
        .corner-decoration {
          position: absolute;
          width: 48px;
          height: 48px;
          opacity: 0.6;
        }
        
        .corner-top-left {
          top: 24px;
          left: 24px;
          border-left: 4px solid #d4af37;
          border-top: 4px solid #d4af37;
          border-top-left-radius: 8px;
        }
        
        .corner-top-right {
          top: 24px;
          right: 24px;
          border-right: 4px solid #d4af37;
          border-top: 4px solid #d4af37;
          border-top-right-radius: 8px;
        }
        
        .corner-bottom-left {
          bottom: 24px;
          left: 24px;
          border-left: 4px solid #d4af37;
          border-bottom: 4px solid #d4af37;
          border-bottom-left-radius: 8px;
        }
        
        .corner-bottom-right {
          bottom: 24px;
          right: 24px;
          border-right: 4px solid #d4af37;
          border-bottom: 4px solid #d4af37;
          border-bottom-right-radius: 8px;
        }
        
        .content {
          position: relative;
          z-index: 10;
          padding: 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: 800;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          border: 2px solid white;
        }
        
        .brand-text h3 {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .brand-text p {
          font-size: 12px;
          color: #6b7280;
          margin: 2px 0 0 0;
          font-weight: 500;
        }
        
        .brand-text .authority {
          font-size: 10px;
          color: #9ca3af;
          margin: 2px 0 0 0;
          font-style: italic;
        }
        
        .year-badge {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid #93c5fd;
          text-align: center;
        }
        
        .year {
          font-size: 20px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 2px;
          margin: 0;
        }
        
        .year-label {
          font-size: 9px;
          color: #2563eb;
          font-weight: 500;
          margin: 2px 0 0 0;
        }
        
        .certificate-title {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }
        
        .title-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          border-radius: 12px;
          opacity: 0.3;
        }
        
        .certificate-title h1 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 4px 0;
          letter-spacing: 3px;
          position: relative;
          padding: 12px 0;
        }
        
        .certificate-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: 3px;
        }
        
        .certificate-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          gap: 24px;
        }
        
        .presentation-text {
          font-size: 16px;
          color: #374151;
          font-weight: 500;
          margin: 0;
        }
        
        .recipient-section {
          margin: 32px 0;
          position: relative;
        }
        
        .recipient-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(252, 211, 77, 0.1), transparent);
          border-radius: 12px;
        }
        
        .recipient-name {
          font-family: 'Playfair Display', serif;
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
          letter-spacing: 2px;
          position: relative;
          padding: 16px 0;
        }
        
        .name-underline {
          width: 160px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 0 auto;
          border-radius: 1px;
        }
        
        .completion-text {
          font-size: 16px;
          color: #374151;
          margin: 12px 0;
        }
        
        .course-section {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          padding: 16px 24px;
          border-radius: 12px;
          border: 1px solid #93c5fd;
          margin: 12px 0;
        }
        
        .course-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .conducted-text {
          font-size: 16px;
          color: #374151;
          margin: 12px 0 6px 0;
        }
        
        .date-text {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        
        .authority-section {
          margin-top: 24px;
          background: linear-gradient(90deg, #f9fafb, #ffffff, #f9fafb);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }
        
        .authority-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          font-size: 10px;
        }
        
        .authority-column h4 {
          font-size: 12px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }
        
        .authority-details {
          color: #6b7280;
          line-height: 1.5;
        }
        
        .authority-details p {
          margin: 6px 0;
        }
        
        .authority-name {
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 6px;
        }
        
        .contact-info {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 4px 0;
        }
        
        .license-number {
          font-size: 9px;
          color: #9ca3af;
          margin-top: 12px;
          font-weight: 500;
        }
        
        .signatures {
          margin-top: 24px;
        }
        
        .signatures-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
        }
        
        .signature-item {
          text-align: center;
        }
        
        .signature-line {
          width: 96px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9ca3af, transparent);
          margin: 0 auto 8px;
          border-radius: 1px;
        }
        
        .signature-name {
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          margin: 0;
        }
        
        .signature-title {
          font-size: 10px;
          color: #6b7280;
          margin: 2px 0 0 0;
        }
        
        .signature-org {
          font-size: 9px;
          color: #9ca3af;
          margin: 1px 0 0 0;
        }
        
        .certificate-footer {
          text-align: center;
          margin-top: 20px;
        }
        
        .certificate-id-section {
          background: #f9fafb;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          display: inline-block;
        }
        
        .certificate-id {
          font-size: 10px;
          color: #6b7280;
          margin: 0 0 4px 0;
          font-weight: 500;
        }
        
        .certificate-status {
          font-size: 10px;
          color: #6b7280;
          margin: 4px 0 0 0;
          font-weight: 500;
        }
        
        .certificate-number {
          font-family: 'Courier New', monospace;
          font-weight: 700;
          color: #1f2937;
        }
        
        .verification-url {
          font-size: 9px;
          color: #9ca3af;
          margin: 8px 0 0 0;
        }
        
        .status-valid {
          color: #059669;
          font-weight: 700;
        }
        
        .status-revoked {
          color: #dc2626;
          font-weight: 700;
        }
        
        @media print {
          body { 
            background: white; 
            padding: 0; 
            min-height: auto;
          }
          .certificate { 
            box-shadow: none; 
            width: 100%;
            height: auto;
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="inner-border"></div>
        <div class="gold-border"></div>
        
        <div class="corner-decoration corner-top-left"></div>
        <div class="corner-decoration corner-top-right"></div>
        <div class="corner-decoration corner-bottom-left"></div>
        <div class="corner-decoration corner-bottom-right"></div>
        
        <div class="content">
          <div class="header">
            <div class="brand">
              <div class="logo">RC</div>
              <div class="brand-text">
                <h3>RaceCoding Institute</h3>
                <p>Excellence in Digital Education</p>
                <p class="authority">Authorized Training & Certification Center</p>
              </div>
            </div>
            <div class="year-badge">
              <div class="year">2024</div>
              <div class="year-label">Certificate Year</div>
            </div>
          </div>
          
          <div class="certificate-title">
            <div class="title-background"></div>
            <h1>CERTIFICATE</h1>
            <h2>OF COMPLETION</h2>
          </div>
          
          <div class="certificate-body">
            <p class="presentation-text">This certificate is proudly presented to</p>
            
            <div class="recipient-section">
              <div class="recipient-background"></div>
              <h2 class="recipient-name">${certificate.profiles.full_name}</h2>
              <div class="name-underline"></div>
            </div>
            
            <div>
              <p class="completion-text">has successfully completed the course on</p>
              <div class="course-section">
                <h3 class="course-name">${certificate.courses.title}</h3>
              </div>
              <p class="conducted-text">Conducted by RaceCoding Institute</p>
              <p class="date-text">on ${new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          
          <div class="authority-section">
            <div class="authority-grid">
              <div class="authority-column">
                <h4>Issuing Authority</h4>
                <div class="authority-details">
                  <p class="authority-name">RaceCoding Institute Pvt. Ltd.</p>
                  <div class="contact-info">📍 123 Tech Park, Digital City, TC 560001</div>
                  <div class="contact-info">📞 +91-9876543210</div>
                  <div class="contact-info">✉️ certificates@racecoding.com</div>
                  <div class="contact-info">🌐 www.racecoding.com</div>
                </div>
              </div>
              <div class="authority-column">
                <h4>Accreditation & Recognition</h4>
                <div class="authority-details">
                  <p>ISO 9001:2015 Certified Training Institute</p>
                  <p>Approved by Ministry of Skill Development</p>
                  <p>Recognized by Industry Skills Council</p>
                  <p>Member of International Training Association</p>
                  <p class="license-number">License No: EDU/CERT/2024/RC001</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="signatures">
            <div class="signatures-grid">
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-name">Dr. Rajesh Kumar</p>
                <p class="signature-title">Technical Director</p>
                <p class="signature-org">RaceCoding Institute</p>
              </div>
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-name">Prof. Meera Sharma</p>
                <p class="signature-title">Academic Head</p>
                <p class="signature-org">RaceCoding Institute</p>
              </div>
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-name">Mr. Arjun Singh</p>
                <p class="signature-title">CEO & Founder</p>
                <p class="signature-org">RaceCoding Institute</p>
              </div>
            </div>
          </div>
          
          <div class="certificate-footer">
            <div class="certificate-id-section">
              <p class="certificate-id">
                Certificate ID: <span class="certificate-number">${certificate.certificate_number}</span>
              </p>
              <p class="certificate-status">
                Status: <span class="${certificate.is_valid ? 'status-valid' : 'status-revoked'}">
                  ${certificate.is_valid ? 'Valid & Verified' : 'Revoked'}
                </span>
              </p>
              <p class="verification-url">
                Verify this certificate at: www.racecoding.com/verify
              </p>
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
