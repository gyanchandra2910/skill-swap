const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS  // Your app password (not regular password)
    }
  });
};

// Email templates
const emailTemplates = {
  // User account banned notification
  userBanned: (userName, reason) => ({
    subject: '🚫 Account Suspended - Skill Swap Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">⚠️ Account Suspended</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
          <h2 style="color: #dc3545; margin-top: 0;">Dear ${userName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            We regret to inform you that your Skill Swap account has been temporarily suspended.
          </p>
          
          <div style="background: #fff; padding: 20px; border-radius: 5px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <h3 style="color: #dc3545; margin-top: 0;">Reason for Suspension:</h3>
            <p style="margin: 0; font-size: 16px; color: #495057;">${reason}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            If you believe this suspension was made in error or have questions about this decision, 
            please contact our support team at <a href="mailto:${process.env.EMAIL_USER}" style="color: #007bff;">${process.env.EMAIL_USER}</a>.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6c757d; margin: 0;">
            Best regards,<br>
            <strong>Skill Swap Admin Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // User account unbanned notification
  userUnbanned: (userName) => ({
    subject: '✅ Account Restored - Skill Swap Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Account Restored</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
          <h2 style="color: #28a745; margin-top: 0;">Great news, ${userName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Your Skill Swap account has been successfully restored and you can now access all platform features again.
          </p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">You can now:</h3>
            <ul style="margin: 0; color: #155724;">
              <li>Search for skills and teachers</li>
              <li>Request skill swaps</li>
              <li>Communicate with other users</li>
              <li>Access your profile and dashboard</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/login" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Login to Your Account
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            We appreciate your understanding and look forward to having you back in our community.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6c757d; margin: 0;">
            Best regards,<br>
            <strong>Skill Swap Admin Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Welcome email for new admin
  adminWelcome: (adminName) => ({
    subject: '👑 Welcome to Skill Swap Admin Team',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6f42c1, #e83e8c); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">👑 Admin Access Granted</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
          <h2 style="color: #6f42c1; margin-top: 0;">Welcome, ${adminName}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Congratulations! You have been granted administrator privileges on the Skill Swap platform.
          </p>
          
          <div style="background: #e7e3ff; padding: 20px; border-radius: 5px; border-left: 4px solid #6f42c1; margin: 20px 0;">
            <h3 style="color: #4c2a85; margin-top: 0;">Your Admin Responsibilities:</h3>
            <ul style="margin: 0; color: #4c2a85;">
              <li>Monitor user activities and platform usage</li>
              <li>Manage user accounts (ban/unban when necessary)</li>
              <li>Review reports and resolve conflicts</li>
              <li>Maintain platform safety and community guidelines</li>
              <li>Generate platform statistics and reports</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/admin" style="background: #6f42c1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Access Admin Dashboard
            </a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Please use your admin privileges responsibly and reach out if you have any questions.
          </p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6c757d; margin: 0;">
            Best regards,<br>
            <strong>Skill Swap Platform Team</strong>
          </p>
        </div>
      </div>
    `
  }),

  // Platform report summary
  platformReport: (adminName, stats, period) => ({
    subject: `📊 Platform Report - ${period}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #17a2b8, #20c997); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">📊 Platform Report</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">${period}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #dee2e6;">
          <h2 style="color: #17a2b8; margin-top: 0;">Hi ${adminName},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Here's your platform summary for ${period}:
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 25px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; text-align: center;">
              <h3 style="color: #28a745; margin: 0 0 5px 0; font-size: 24px;">${stats.totalUsers || 0}</h3>
              <p style="margin: 0; color: #6c757d;">Total Users</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; text-align: center;">
              <h3 style="color: #007bff; margin: 0 0 5px 0; font-size: 24px;">${stats.totalSwaps || 0}</h3>
              <p style="margin: 0; color: #6c757d;">Total Swaps</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; text-align: center;">
              <h3 style="color: #ffc107; margin: 0 0 5px 0; font-size: 24px;">${stats.pendingSwaps || 0}</h3>
              <p style="margin: 0; color: #6c757d;">Pending Swaps</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; text-align: center;">
              <h3 style="color: #dc3545; margin: 0 0 5px 0; font-size: 24px;">${stats.avgRating || 0}</h3>
              <p style="margin: 0; color: #6c757d;">Avg Rating</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/admin" style="background: #17a2b8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Full Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6c757d; margin: 0;">
            Best regards,<br>
            <strong>Skill Swap Platform</strong>
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Skill Swap Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Specific email functions
const sendUserBannedEmail = async (userEmail, userName, reason) => {
  const template = emailTemplates.userBanned(userName, reason);
  return await sendEmail(userEmail, template);
};

const sendUserUnbannedEmail = async (userEmail, userName) => {
  const template = emailTemplates.userUnbanned(userName);
  return await sendEmail(userEmail, template);
};

const sendAdminWelcomeEmail = async (adminEmail, adminName) => {
  const template = emailTemplates.adminWelcome(adminName);
  return await sendEmail(adminEmail, template);
};

const sendPlatformReportEmail = async (adminEmail, adminName, stats, period = 'Weekly') => {
  const template = emailTemplates.platformReport(adminName, stats, period);
  return await sendEmail(adminEmail, template);
};

module.exports = {
  sendEmail,
  sendUserBannedEmail,
  sendUserUnbannedEmail,
  sendAdminWelcomeEmail,
  sendPlatformReportEmail,
  emailTemplates
};
