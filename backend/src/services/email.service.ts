import * as brevo from "@getbrevo/brevo";

interface EmailRecipient {
  email: string;
  name: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn("BREVO_API_KEY not configured. Emails will not be sent.");
    }

    this.fromEmail = process.env.BREVO_FROM_EMAIL || "noreply@dharitri.gov.in";
    this.fromName = process.env.BREVO_FROM_NAME || "DHARITRI Platform";

    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey || "",
    );
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    if (!process.env.BREVO_API_KEY) {
      console.log("[Email] Skipped (no API key):", params.subject);
      return;
    }

    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.sender = {
        email: this.fromEmail,
        name: this.fromName,
      };

      sendSmtpEmail.to = params.to;
      sendSmtpEmail.subject = params.subject;
      sendSmtpEmail.htmlContent = params.htmlContent;
      sendSmtpEmail.textContent = params.textContent;

      await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(`[Email] Sent: ${params.subject} to ${params.to.map(t => t.email).join(", ")}`);
    } catch (error) {
      console.error("[Email] Failed to send:", error);
      throw error;
    }
  }

  async sendUserWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1c9d64 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #1c9d64; margin: 20px 0; }
    .steps { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .step { margin: 15px 0; padding-left: 30px; position: relative; }
    .step::before { content: "✓"; position: absolute; left: 0; color: #1c9d64; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🏛️ DHARITRI</h1>
      <p style="margin: 10px 0 0 0;">Digital Land Acquisition Platform</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1c9d64;">Welcome to DHARITRI!</h2>
      
      <p>Hello <strong>${userName}</strong>,</p>
      
      <p>Thank you for registering with DHARITRI, India's digital land acquisition platform. Your account has been created successfully.</p>
      
      <div class="info-box">
        <p style="margin: 0;"><strong>📧 Email:</strong> ${userEmail}</p>
        <p style="margin: 10px 0 0 0;"><strong>⏰ Status:</strong> Pending Approval</p>
      </div>
      
      <h3 style="color: #1c9d64;">What happens next?</h3>
      
      <div class="steps">
        <div class="step">An administrator will review your account details</div>
        <div class="step">You'll be assigned an appropriate role based on your department</div>
        <div class="step">You'll receive an email notification once approved</div>
        <div class="step">You can then access the full DHARITRI platform</div>
      </div>
      
      <p><strong>⏱️ Typical approval time: 1-2 business days</strong></p>
      
      <p>Once approved, you'll have access to:</p>
      <ul>
        <li>Project management tools</li>
        <li>GIS mapping and visualization</li>
        <li>Compensation calculation</li>
        <li>Field verification system</li>
        <li>Document management</li>
        <li>Analytics and reporting</li>
      </ul>
      
      <p>If you have any questions, please contact your department administrator.</p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>DHARITRI Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated email from DHARITRI Platform.</p>
      <p>© 2026 Government of India. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "Welcome to DHARITRI - Account Pending Approval",
      htmlContent,
      textContent: `Welcome to DHARITRI!\n\nHello ${userName},\n\nYour account has been created and is awaiting approval from an administrator.\n\nEmail: ${userEmail}\nStatus: Pending Approval\n\nYou'll receive an email once your account is approved.\n\nBest regards,\nDHARITRI Team`,
    });
  }

  async sendAdminNotificationEmail(
    adminEmail: string,
    adminName: string,
    newUser: {
      name: string;
      email: string;
      requestedDepartment?: string | null;
      requestedRole?: string | null;
      requestReason?: string | null;
      createdAt: Date;
    },
    userId: string,
  ): Promise<void> {
    const appUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const approveUrl = `${appUrl}/dashboard/admin/users?user=${userId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #c96a3e 0%, #e0972a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .user-card { background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0972a; margin: 20px 0; }
    .info-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 4px; }
    .info-label { font-weight: bold; color: #6b7280; }
    .request-box { background: #fef3c7; padding: 15px; border-left: 4px solid #e0972a; margin: 20px 0; }
    .btn { display: inline-block; padding: 12px 30px; background: #1c9d64; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
    .btn:hover { background: #10b981; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🆕 New User Registration</h1>
      <p style="margin: 10px 0 0 0;">Awaiting Your Approval</p>
    </div>
    
    <div class="content">
      <p>Hello <strong>${adminName}</strong>,</p>
      
      <p>A new user has registered on DHARITRI and requires role assignment and approval.</p>
      
      <div class="user-card">
        <h3 style="color: #c96a3e; margin-top: 0;">User Details</h3>
        
        <div class="info-row">
          <span class="info-label">👤 Name:</span> ${newUser.name}
        </div>
        
        <div class="info-row">
          <span class="info-label">📧 Email:</span> ${newUser.email}
        </div>
        
        ${newUser.requestedDepartment ? `
        <div class="info-row">
          <span class="info-label">🏢 Requested Department:</span> ${newUser.requestedDepartment}
        </div>
        ` : ""}
        
        ${newUser.requestedRole ? `
        <div class="info-row">
          <span class="info-label">🎭 Requested Role:</span> ${newUser.requestedRole}
        </div>
        ` : ""}
        
        <div class="info-row">
          <span class="info-label">📅 Signed Up:</span> ${new Date(newUser.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </div>
      </div>
      
      ${newUser.requestReason ? `
      <div class="request-box">
        <strong>📝 Reason for Access:</strong>
        <p style="margin: 10px 0 0 0;">"${newUser.requestReason}"</p>
      </div>
      ` : ""}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${approveUrl}" class="btn">👉 Review & Approve User</a>
      </div>
      
      <p style="font-size: 14px; color: #6b7280;">Or copy this link to your browser:</p>
      <p style="font-size: 12px; color: #3b82f6; word-break: break-all;">${approveUrl}</p>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      
      <p style="font-size: 14px;">This email was sent to you because you are an administrator with approval permissions.</p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>DHARITRI System</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated notification from DHARITRI Platform.</p>
      <p>© 2026 Government of India. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: [{ email: adminEmail, name: adminName }],
      subject: `🆕 New User Awaiting Approval - ${newUser.name}`,
      htmlContent,
      textContent: `New User Awaiting Approval\n\nName: ${newUser.name}\nEmail: ${newUser.email}\n${newUser.requestedDepartment ? `Department: ${newUser.requestedDepartment}\n` : ""}${newUser.requestedRole ? `Role: ${newUser.requestedRole}\n` : ""}\n\nReview and approve: ${approveUrl}\n\nDHARITRI Team`,
    });
  }

  async sendUserApprovedEmail(
    userEmail: string,
    userName: string,
    assignedRole: string,
    approverName: string,
    stateId?: string | null,
    districtId?: string | null,
  ): Promise<void> {
    const appUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const loginUrl = `${appUrl}/dashboard`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1c9d64 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .success-box { background: #d1fae5; padding: 20px; border-left: 4px solid #1c9d64; margin: 20px 0; border-radius: 4px; }
    .info-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .info-row { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 4px; }
    .btn { display: inline-block; padding: 15px 40px; background: #1c9d64; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .btn:hover { background: #10b981; }
    .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .feature { margin: 10px 0; padding-left: 25px; position: relative; }
    .feature::before { content: "✓"; position: absolute; left: 0; color: #1c9d64; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Account Approved!</h1>
      <p style="margin: 10px 0 0 0;">You're All Set to Use DHARITRI</p>
    </div>
    
    <div class="content">
      <p>Hello <strong>${userName}</strong>,</p>
      
      <div class="success-box">
        <h3 style="margin: 0 0 10px 0; color: #1c9d64;">🎉 Great news!</h3>
        <p style="margin: 0;">Your DHARITRI account has been approved and activated. You can now access the full platform.</p>
      </div>
      
      <div class="info-card">
        <h3 style="color: #1c9d64; margin-top: 0;">Your Account Details</h3>
        
        <div class="info-row">
          <strong>✅ Status:</strong> Active
        </div>
        
        <div class="info-row">
          <strong>🎭 Assigned Role:</strong> ${assignedRole.replace(/_/g, " ")}
        </div>
        
        ${stateId ? `
        <div class="info-row">
          <strong>📍 State:</strong> ${stateId}
        </div>
        ` : ""}
        
        ${districtId ? `
        <div class="info-row">
          <strong>🏙️ District:</strong> ${districtId}
        </div>
        ` : ""}
        
        <div class="info-row">
          <strong>👤 Approved By:</strong> ${approverName}
        </div>
        
        <div class="info-row">
          <strong>📅 Approved:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
        </div>
      </div>
      
      <div style="text-align: center;">
        <a href="${loginUrl}" class="btn">🚀 Login to DHARITRI</a>
      </div>
      
      <div class="features">
        <h3 style="color: #1c9d64;">Features You Can Now Access:</h3>
        <div class="feature">Project management and tracking</div>
        <div class="feature">GIS mapping and visualization</div>
        <div class="feature">Compensation calculation</div>
        <div class="feature">Field verification system</div>
        <div class="feature">Document management</div>
        <div class="feature">Analytics and reporting</div>
        <div class="feature">Real-time notifications</div>
      </div>
      
      <h3 style="color: #1c9d64;">Need Help Getting Started?</h3>
      <p>We've prepared comprehensive documentation and video tutorials to help you get started with DHARITRI.</p>
      
      <p style="margin-top: 30px;">If you have any questions, please contact your department administrator or system support.</p>
      
      <p style="margin-top: 30px;">Welcome aboard!<br><strong>DHARITRI Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated email from DHARITRI Platform.</p>
      <p>© 2026 Government of India. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "✅ DHARITRI Account Approved - You're All Set!",
      htmlContent,
      textContent: `DHARITRI Account Approved!\n\nHello ${userName},\n\nGreat news! Your account has been approved.\n\nRole: ${assignedRole}\nApproved by: ${approverName}\n\nYou can now login: ${loginUrl}\n\nWelcome to DHARITRI!\n\nBest regards,\nDHARITRI Team`,
    });
  }

  async sendUserRejectedEmail(
    userEmail: string,
    userName: string,
    reason?: string,
  ): Promise<void> {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .notice-box { background: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">DHARITRI Account Status</h1>
    </div>
    
    <div class="content">
      <p>Hello <strong>${userName}</strong>,</p>
      
      <div class="notice-box">
        <p style="margin: 0;">We regret to inform you that your DHARITRI account application was not approved at this time.</p>
      </div>
      
      ${reason ? `
      <h3>Reason:</h3>
      <p style="background: white; padding: 15px; border-radius: 4px;">${reason}</p>
      ` : ""}
      
      <p>If you believe this was an error or would like to reapply, please contact your department administrator.</p>
      
      <p style="margin-top: 30px;">Best regards,<br><strong>DHARITRI Team</strong></p>
    </div>
    
    <div class="footer">
      <p>This is an automated email from DHARITRI Platform.</p>
      <p>© 2026 Government of India. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: [{ email: userEmail, name: userName }],
      subject: "DHARITRI Account Application Status",
      htmlContent,
      textContent: `DHARITRI Account Status\n\nHello ${userName},\n\nYour account application was not approved.\n${reason ? `\nReason: ${reason}\n` : ""}\nPlease contact your administrator for more information.\n\nBest regards,\nDHARITRI Team`,
    });
  }
}

export const emailService = new EmailService();
