import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@stararc.one';
    
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production email configuration with Hostpoint SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // false for port 587 (STARTTLS)
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: true // Enforce certificate validation
        }
      });
      
      // Verify SMTP connection on startup
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ SMTP connection failed:', error);
          console.error('Check your Hostpoint SMTP credentials in environment variables');
        } else {
          console.log('✅ SMTP server ready to send emails via Hostpoint');
          console.log(`📧 Sender: ${this.fromEmail}`);
        }
      });
    } else {
      // Development: Use Ethereal Email for testing
      console.log('🧪 Development mode: Using Ethereal Email (test only)');
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }
  }

  // Send email verification
  async sendEmailVerification(email: string, alias: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Stararc - E-Mail bestätigen',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">E-Mail bestätigen</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Bitte bestätigen Sie Ihre E-Mail-Adresse, um Ihr Stararc-Konto zu aktivieren:
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              E-Mail bestätigen
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Der Link ist 24 Stunden gültig.
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Falls der Button nicht funktioniert:<br>
            <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      // In development, log preview URL
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send password reset email
  async sendPasswordReset(email: string, alias: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Stararc - Passwort zurücksetzen',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Passwort zurücksetzen</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Klicken Sie auf den Button, um ein neues Passwort zu erstellen:
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Passwort zurücksetzen
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Der Link ist 1 Stunde gültig. Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Falls der Button nicht funktioniert:<br>
            <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      // In development, log preview URL
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Send welcome email after email verification
  async sendWelcomeEmail(email: string, alias: string): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Willkommen bei Stararc',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Willkommen bei Stararc</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Ihr Konto ist aktiviert. Sie können sich jetzt einloggen und mit Stararc beginnen.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${loginUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Jetzt einloggen
            </a>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #3b82f6;">
            <p style="color: #4b5563; line-height: 1.6; margin: 0;">
              <strong>Nach dem Login:</strong><br>
              Sie werden durch <em>Getting Started</em> und <em>Getting Better</em> geführt. 
              Diese Schritte helfen Ihnen, Stararc optimal zu nutzen – können aber auch jederzeit übersprungen werden.
            </p>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      // In development, log preview URL
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}