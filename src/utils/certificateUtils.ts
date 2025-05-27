
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
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
          display: flex;
          flex-direction: column;
        }
        
        .background-design {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .top-right-curve {
          position: absolute;
          top: 0;
          right: 0;
          width: 256px;
          height: 256px;
        }
        
        .bottom-left-curve {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 288px;
          height: 288px;
        }
        
        .watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.03;
          transform: rotate(-12deg);
          font-size: 100px;
          font-weight: 800;
          color: #9ca3af;
          pointer-events: none;
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
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: 800;
        }
        
        .brand-text h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .brand-text p {
          font-size: 12px;
          color: #6b7280;
          margin: 2px 0 0 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .year {
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .certificate-title {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .certificate-title h1 {
          font-size: 60px;
          font-weight: 700;
          color: #2563eb;
          margin: 0 0 8px 0;
          letter-spacing: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .certificate-title h2 {
          font-size: 48px;
          font-weight: 700;
          color: #2563eb;
          margin: 0;
          letter-spacing: 4px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
          font-size: 18px;
          color: #374151;
          font-weight: 500;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .recipient-section {
          margin: 32px 0;
        }
        
        .recipient-name {
          font-size: 48px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 16px 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .name-underline {
          width: 128px;
          height: 2px;
          background: #9ca3af;
          margin: 0 auto;
        }
        
        .completion-text {
          font-size: 18px;
          color: #374151;
          margin: 8px 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .course-name {
          font-size: 28px;
          font-weight: 700;
          color: #2563eb;
          margin: 8px 0;
          padding: 8px 24px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .conducted-text {
          font-size: 18px;
          color: #374151;
          margin: 8px 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .date-text {
          font-size: 18px;
          color: #374151;
          margin: 8px 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          margin-top: 32px;
        }
        
        .signature-item {
          text-align: center;
        }
        
        .signature-line {
          width: 96px;
          height: 1px;
          background: #9ca3af;
          margin: 0 auto 8px;
        }
        
        .signature-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .signature-subtitle {
          font-size: 12px;
          color: #6b7280;
          margin: 2px 0 0 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .certificate-footer {
          text-align: center;
          margin-top: 24px;
        }
        
        .certificate-id {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .status-valid {
          color: #059669;
        }
        
        .status-revoked {
          color: #dc2626;
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
        <div class="background-design">
          <div class="top-right-curve">
            <svg viewBox="0 0 256 256" style="width: 100%; height: 100%;">
              <path d="M256,0 L256,128 Q128,256 0,256 L0,0 Z" fill="#2563eb" opacity="0.15"/>
            </svg>
          </div>
          <div class="bottom-left-curve">
            <svg viewBox="0 0 288 288" style="width: 100%; height: 100%;">
              <path d="M0,288 L0,144 Q72,72 216,72 L288,72 L288,288 Z" fill="#2563eb" opacity="0.15"/>
            </svg>
          </div>
          <div class="watermark">RaceCoding</div>
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
            <div class="year">2024</div>
          </div>
          
          <div class="certificate-title">
            <h1>CERTIFICATE</h1>
            <h2>OF COMPLETION</h2>
          </div>
          
          <div class="certificate-body">
            <p class="presentation-text">This certificate is proudly presented to</p>
            
            <div class="recipient-section">
              <h2 class="recipient-name">${certificate.profiles.full_name}</h2>
              <div class="name-underline"></div>
            </div>
            
            <div>
              <p class="completion-text">has successfully completed the course on</p>
              <h3 class="course-name">${certificate.courses.title}</h3>
              <p class="conducted-text">Conducted by RaceCoding Institute</p>
              <p class="date-text">on ${new Date(certificate.issued_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          
          <div class="signatures">
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
          
          <div class="certificate-footer">
            <p class="certificate-id">
              Certificate ID: ${certificate.certificate_number} | 
              Status: <span class="${certificate.is_valid ? 'status-valid' : 'status-revoked'}">
                ${certificate.is_valid ? 'Valid' : 'Revoked'}
              </span>
            </p>
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
