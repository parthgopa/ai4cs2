const nodemailer = require('nodemailer');

// Create transporter using Gmail or mock for testing
const createTransporter = () => {
  // For testing, use a mock transporter if email fails
  if (process.env.USE_MOCK_EMAIL === 'true') {
    return {
      verify: async () => true,
      sendMail: async (options) => ({
        messageId: 'mock-' + Date.now(),
        accepted: [options.to],
        rejected: []
      })
    };
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'aiguru9873@gmail.com',
      pass: process.env.EMAIL_PASS || 'dyawtxyqjucxybis'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, username) => {
  try {
    console.log("=== EMAIL SERVICE START ===");
    console.log("Attempting to send OTP to:", email);
    console.log("OTP:", otp);
    console.log("Username:", username);
    
    const transporter = createTransporter();
    console.log("Transporter created successfully");
    
    // Test transporter connection
    console.log("Testing SMTP connection...");
    await transporter.verify();
    console.log("SMTP connection verified successfully");
    
    const mailOptions = {
      from: {
        name: 'AI4CS - AI Company Secretary',
        address: 'aiguru9873@gmail.com'
      },
      to: email,
      subject: 'Email Verification - AI4CS Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              color: #0b5ed7;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .otp-box {
              background: linear-gradient(135deg, #0b5ed7, #4ba3f5);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              margin: 10px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">AI4CS</div>
              <h2>Email Verification Required</h2>
            </div>
            
            <p>Hello <strong>${username}</strong>,</p>
            
            <p>Thank you for registering with AI4CS - Your AI Company Secretary. To complete your registration, please verify your email address using the OTP below:</p>
            
            <div class="otp-box">
              <div>Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div>Valid for 10 minutes</div>
            </div>
            
            <div class="warning">
              <strong>Security Notice:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone. If you didn't request this verification, please ignore this email.
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <div class="footer">
              <p>Best regards,<br>
              <strong>AI4CS Team</strong><br>
              AI Company Secretary Platform</p>
              
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log("Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    console.log("Email result:", result);
    console.log("=== EMAIL SERVICE END ===");
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('=== EMAIL SERVICE ERROR ===');
    console.error('Error sending OTP email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    console.error('=== EMAIL SERVICE ERROR END ===');
    return { success: false, error: error.message };
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (email, username) => {
  try {
    console.log("=== WELCOME EMAIL SERVICE START ===");
    console.log("Sending welcome email to:", email);
    console.log("Username:", username);
    
    const transporter = createTransporter();
    console.log("Transporter created successfully");
    
    // Test transporter connection (skip for mock)
    if (process.env.USE_MOCK_EMAIL !== 'true') {
      console.log("Testing SMTP connection...");
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    }
    
    const mailOptions = {
      from: {
        name: 'AI4CS - AI Company Secretary',
        address: process.env.EMAIL_USER || 'aiguru9873@gmail.com'
      },
      to: email,
      subject: '🎉 Welcome to AI4CS - Your AI Company Secretary Journey Begins!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to AI4CS</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 0 25px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              background: linear-gradient(135deg, #0b5ed7, #4ba3f5);
              color: white;
              padding: 30px;
              border-radius: 10px;
              margin: -30px -30px 30px -30px;
            }
            .logo {
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .welcome-message {
              background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
              padding: 25px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 5px solid #0b5ed7;
            }
            .features {
              margin: 30px 0;
            }
            .feature-item {
              display: flex;
              align-items: center;
              margin: 15px 0;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .feature-icon {
              font-size: 24px;
              margin-right: 15px;
              width: 40px;
              text-align: center;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #0b5ed7, #4ba3f5);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              color: #0b5ed7;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🤖 AI4CS</div>
              <h1>Welcome to the Future of Company Secretarial Services!</h1>
            </div>
            
            <div class="welcome-message">
              <h2>🎉 Hello ${username}!</h2>
              <p>Congratulations on joining AI4CS - Your intelligent AI Company Secretary! We're thrilled to have you on board and excited to help you streamline your company secretarial work with cutting-edge AI technology.</p>
            </div>
            
            <h3>🚀 What You Can Do With AI4CS:</h3>
            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">📋</div>
                <div>
                  <strong>Policy Drafting</strong><br>
                  Generate comprehensive company policies with AI assistance
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📅</div>
                <div>
                  <strong>Compliance Calendar</strong><br>
                  Never miss important compliance deadlines again
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">⚖️</div>
                <div>
                  <strong>Legal Research</strong><br>
                  Get instant legal opinions and research assistance
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">📝</div>
                <div>
                  <strong>Document Drafting</strong><br>
                  Create agreements, resolutions, and legal documents effortlessly
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">🤝</div>
                <div>
                  <strong>Meeting Assistance</strong><br>
                  AI-powered board and general meeting support
                </div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000" class="cta-button">
                🚀 Start Your AI Journey Now
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #ffc107;">
              <h4>💡 Pro Tip:</h4>
              <p>Start with our <strong>Compliance Calendar</strong> to get an overview of your company's compliance requirements, then explore our AI-powered policy drafting tools to create comprehensive governance documents.</p>
            </div>
            
            <div class="footer">
              <p><strong>Need Help Getting Started?</strong></p>
              <p>Our AI assistant is available 24/7 to help you navigate through all features. Simply log in and start exploring!</p>
              
              <div class="social-links">
                <a href="#">📧 Support</a> |
                <a href="#">📚 Documentation</a> |
                <a href="#">💬 Community</a>
              </div>
              
              <p>Best regards,<br>
              <strong>The AI4CS Team</strong><br>
              Revolutionizing Company Secretarial Services with AI</p>
              
              <p style="font-size: 12px; color: #999;">
                This is an automated welcome email. You're receiving this because you successfully registered for AI4CS.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log("Sending welcome email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    console.log("Welcome email result:", result);
    console.log("=== WELCOME EMAIL SERVICE END ===");
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('=== WELCOME EMAIL SERVICE ERROR ===');
    console.error('Error sending welcome email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    console.error('=== WELCOME EMAIL SERVICE ERROR END ===');
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail
};
