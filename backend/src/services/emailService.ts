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
      subject: '🎉 Willkommen bei Stararc - Ihr Konto ist aktiviert!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6ee7b7; font-size: 32px; margin: 0;">🚀 Stararc</h1>
            <p style="color: #d1fae5; margin: 10px 0;">Zero-Knowledge Portfolio Management</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="color: #f0fdf4; margin-bottom: 20px;">🎉 Herzlich willkommen ${alias}!</h2>
            
            <p style="color: #d1fae5; line-height: 1.6; margin-bottom: 25px;">
              Ihr Stararc-Konto ist jetzt aktiviert! Sie können sich einloggen und beginnen, 
              Ihre Vermögenswerte mit unserer Privacy-by-Design Plattform zu verwalten.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="display: inline-block; background: #1f2937; color: #6ee7b7; padding: 12px 30px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                🔐 Jetzt einloggen
              </a>
            </div>
            
            <div style="background: rgba(0, 0, 0, 0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #fbbf24; margin: 0 0 15px 0;">💎 Was Sie jetzt tun können:</h3>
              <div style="color: #d1fae5;">
                <div style="margin-bottom: 10px;">📊 <strong>Ganzheitliches Asset Management</strong> - Alle Anlageklassen im Überblick</div>
                <div style="margin-bottom: 10px;">₿ <strong>Bitcoin Self-Custody</strong> - xPub Import und Hardware Wallet Integration</div>
                <div style="margin-bottom: 10px;">🔐 <strong>Privacy-First</strong> - Ihre Daten bleiben verschlüsselt bei Ihnen</div>
                <div style="margin-bottom: 10px;">🇨🇭 <strong>Swiss Standards</strong> - Banking-Level Sicherheit</div>
              </div>
            </div>
            
            <p style="color: #a7f3d0; font-size: 14px; margin-top: 25px;">
              Bei Fragen stehen wir Ihnen gerne zur Verfügung. Viel Spaß mit Stararc!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>🇨🇭 Made in Switzerland | Privacy-by-Design | Zero-Knowledge</p>
            <p>© ${new Date().getFullYear()} Stararc.one - Alle Rechte vorbehalten</p>
          </div>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
  }
}