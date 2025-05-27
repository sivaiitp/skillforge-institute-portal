
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
        body {
          margin: 0;
          padding: 40px;
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .certificate {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 8px solid #d4af37;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid #d4af37;
          border-radius: 10px;
        }
        .header {
          margin-bottom: 40px;
        }
        .title {
          font-size: 48px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .subtitle {
          font-size: 18px;
          color: #7f8c8d;
          margin-bottom: 30px;
        }
        .recipient {
          font-size: 36px;
          font-weight: bold;
          color: #2980b9;
          margin: 30px 0;
          text-decoration: underline;
          text-decoration-color: #d4af37;
        }
        .course {
          font-size: 24px;
          font-weight: bold;
          color: #8e44ad;
          margin: 20px 0;
        }
        .details {
          display: flex;
          justify-content: space-around;
          margin: 40px 0;
          font-size: 14px;
        }
        .detail-item {
          text-align: center;
        }
        .detail-label {
          font-weight: bold;
          color: #34495e;
        }
        .detail-value {
          color: #7f8c8d;
          margin-top: 5px;
        }
        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #95a5a6;
          border-top: 1px solid #ecf0f1;
          padding-top: 20px;
        }
        @media print {
          body { background: white; padding: 0; }
          .certificate { box-shadow: none; border-radius: 0; }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="title">Certificate of Completion</div>
          <div class="subtitle">This is to certify that</div>
        </div>
        
        <div class="recipient">${certificate.profiles.full_name}</div>
        
        <div class="subtitle">has successfully completed the course</div>
        
        <div class="course">${certificate.courses.title}</div>
        
        <div class="details">
          <div class="detail-item">
            <div class="detail-label">Date Issued</div>
            <div class="detail-value">${new Date(certificate.issued_date).toLocaleDateString()}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Certificate ID</div>
            <div class="detail-value">${certificate.certificate_number}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value">${certificate.is_valid ? 'Valid' : 'Revoked'}</div>
          </div>
        </div>
        
        <div class="footer">
          This certificate verifies the successful completion of the above-mentioned course.<br>
          Certificate ID: ${certificate.certificate_number}
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
