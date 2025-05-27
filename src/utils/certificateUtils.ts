
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
          border: 8px solid transparent;
          background: linear-gradient(white, white) padding-box,
                     linear-gradient(45deg, #dbeafe, #e0e7ff, #dbeafe) border-box;
          border-radius: 24px;
        }
        
        .inner-border {
          position: absolute;
          inset: 16px;
          border: 4px double #93c5fd;
          border-radius: 12px;
          pointer-events: none;
        }
        
        .gold-border {
          position: absolute;
          inset: 24px;
          border: 2px solid #d4af37;
          border-radius: 8px;
          opacity: 0.6;
          pointer-events: none;
        }
        
        .background-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.05;
          pointer-events: none;
        }
        
        .pattern-top-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 192px;
          height: 192px;
        }
        
        .pattern-bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 192px;
          height: 192px;
        }
        
        .corner-decoration {
          position: absolute;
          width: 64px;
          height: 64px;
        }
        
        .corner-top-left {
          top: 32px;
          left: 32px;
        }
        
        .corner-top-right {
          top: 32px;
          right: 32px;
          transform: rotate(90deg);
        }
        
        .corner-bottom-left {
          bottom: 32px;
          left: 32px;
          transform: rotate(270deg);
        }
        
        .corner-bottom-right {
          bottom: 32px;
          right: 32px;
          transform: rotate(180deg);
        }
        
        .content {
          position: relative;
          z-index: 10;
          padding: 48px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: 800;
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
          border: 4px solid white;
        }
        
        .brand-text h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .brand-text p {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0 0 0;
          font-weight: 500;
        }
        
        .year-badge {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          padding: 12px 24px;
          border-radius: 16px;
          border: 2px solid #93c5fd;
        }
        
        .year {
          font-size: 28px;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 2px;
          margin: 0;
        }
        
        .certificate-title {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
        }
        
        .title-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          border-radius: 12px;
        }
        
        .certificate-title h1 {
          font-family: 'Playfair Display', serif;
          font-size: 60px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          letter-spacing: 4px;
          position: relative;
          padding: 16px 0;
        }
        
        .certificate-title h2 {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: 4px;
        }
        
        .certificate-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          gap: 32px;
        }
        
        .presentation-text {
          font-size: 20px;
          color: #374151;
          font-weight: 500;
          margin: 0;
        }
        
        .recipient-section {
          margin: 40px 0;
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
          font-size: 48px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 24px 0;
          letter-spacing: 2px;
          position: relative;
          padding: 24px 0;
        }
        
        .name-underline {
          width: 192px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          margin: 0 auto;
          border-radius: 2px;
        }
        
        .completion-text {
          font-size: 20px;
          color: #374151;
          margin: 16px 0;
        }
        
        .course-section {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          padding: 24px 32px;
          border-radius: 16px;
          border: 2px solid #93c5fd;
          margin: 16px 0;
        }
        
        .course-name {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .conducted-text {
          font-size: 20px;
          color: #374151;
          margin: 16px 0 8px 0;
        }
        
        .date-text {
          font-size: 18px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        
        .signatures {
          margin-top: 48px;
          position: relative;
        }
        
        .signatures-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.1), transparent);
          border-radius: 12px;
        }
        
        .signatures-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 48px;
          position: relative;
          padding: 24px 0;
        }
        
        .signature-item {
          text-align: center;
        }
        
        .signature-line {
          width: 128px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #9ca3af, transparent);
          margin: 0 auto 12px;
          border-radius: 1px;
        }
        
        .signature-title {
          font-size: 16px;
          font-weight: 700;
          color: #374151;
          margin: 0;
        }
        
        .signature-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 4px 0 0 0;
        }
        
        .certificate-footer {
          text-align: center;
          margin-top: 32px;
        }
        
        .certificate-id-section {
          background: #f9fafb;
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          display: inline-block;
        }
        
        .certificate-id {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 500;
        }
        
        .certificate-number {
          font-family: 'Courier New', monospace;
          font-weight: 700;
          color: #1f2937;
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
        
        <div class="background-pattern">
          <div class="pattern-top-right">
            <svg viewBox="0 0 200 200" style="width: 100%; height: 100%;">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.3"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.2"/>
              <circle cx="100" cy="100" r="40" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.1"/>
            </svg>
          </div>
          <div class="pattern-bottom-left">
            <svg viewBox="0 0 200 200" style="width: 100%; height: 100%;">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.3"/>
              <circle cx="100" cy="100" r="60" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.2"/>
              <circle cx="100" cy="100" r="40" fill="none" stroke="#2563eb" stroke-width="1" opacity="0.1"/>
            </svg>
          </div>
        </div>
        
        <div class="corner-decoration corner-top-left">
          <svg viewBox="0 0 64 64" style="width: 100%; height: 100%;">
            <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
            <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
          </svg>
        </div>
        <div class="corner-decoration corner-top-right">
          <svg viewBox="0 0 64 64" style="width: 100%; height: 100%;">
            <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
            <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
          </svg>
        </div>
        <div class="corner-decoration corner-bottom-left">
          <svg viewBox="0 0 64 64" style="width: 100%; height: 100%;">
            <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
            <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
          </svg>
        </div>
        <div class="corner-decoration corner-bottom-right">
          <svg viewBox="0 0 64 64" style="width: 100%; height: 100%;">
            <path d="M8,8 L56,8 L56,16 L16,16 L16,56 L8,56 Z" fill="#d4af37" opacity="0.7"/>
            <path d="M12,12 L52,12 L52,20 L20,20 L20,52 L12,52 Z" fill="#f4e6a1" opacity="0.5"/>
          </svg>
        </div>
        
        <div class="content">
          <div class="header">
            <div class="brand">
              <div class="logo">RC</div>
              <div class="brand-text">
                <h3>RaceCoding</h3>
                <p>Excellence in Digital Education</p>
              </div>
            </div>
            <div class="year-badge">
              <div class="year">2024</div>
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
          
          <div class="signatures">
            <div class="signatures-background"></div>
            <div class="signatures-grid">
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-title">Technical Director</p>
                <p class="signature-subtitle">RaceCoding</p>
              </div>
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-title">Overall Head</p>
                <p class="signature-subtitle">RaceCoding Institute</p>
              </div>
              <div class="signature-item">
                <div class="signature-line"></div>
                <p class="signature-title">Business Head</p>
                <p class="signature-subtitle">RaceCoding</p>
              </div>
            </div>
          </div>
          
          <div class="certificate-footer">
            <div class="certificate-id-section">
              <p class="certificate-id">
                Certificate ID: <span class="certificate-number">${certificate.certificate_number}</span> | 
                Status: <span class="${certificate.is_valid ? 'status-valid' : 'status-revoked'}">
                  ${certificate.is_valid ? 'Valid' : 'Revoked'}
                </span>
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
