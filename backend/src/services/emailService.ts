import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@stararc.one';
    
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production email configuration (e.g., SendGrid, Mailgun, AWS SES)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Development: Use Ethereal Email for testing
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
      subject: '🚀 Willkommen bei Stararc - Email bestätigen',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1f2937 0%, #3b82f6 100%); color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #60a5fa; font-size: 32px; margin: 0;">🚀 Stararc</h1>
            <p style="color: #d1d5db; margin: 10px 0;">Zero-Knowledge Portfolio Management</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="color: #f3f4f6; margin-bottom: 20px;">Willkommen ${alias}!</h2>
            
            <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
              Vielen Dank für Ihre Registrierung bei Stararc. Um Ihr Konto zu aktivieren und 
              unsere Privacy-by-Design Portfolio Management Plattform zu nutzen, bestätigen Sie 
              bitte Ihre Email-Adresse.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                ✅ Email bestätigen
              </a>
            </div>
            
            <div style="background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #fbbf24; margin: 0 0 10px 0;">🛡️ Privacy-First Approach</h3>
              <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
                <li>Zero-Knowledge Authentifizierung</li>
                <li>Keine Datenspeicherung sensibler Informationen</li>
                <li>Swiss Privacy-by-Design Standards</li>
                <li>End-to-End verschlüsselte Übertragung</li>
              </ul>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 25px;">
              Falls Sie dieses Konto nicht erstellt haben, können Sie diese Email ignorieren.
              Der Verifizierungslink läuft in 24 Stunden ab.
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

  // Send password reset email
  async sendPasswordReset(email: string, alias: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: '🔐 Stararc - Passwort zurücksetzen',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%); color: white;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ddd6fe; font-size: 32px; margin: 0;">🚀 Stararc</h1>
            <p style="color: #e5e7eb; margin: 10px 0;">Zero-Knowledge Portfolio Management</p>
          </div>
          
          <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="color: #f3f4f6; margin-bottom: 20px;">🔐 Passwort zurücksetzen</h2>
            
            <p style="color: #e5e7eb; line-height: 1.6; margin-bottom: 25px;">
              Hallo ${alias},<br><br>
              Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. 
              Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: #ef4444; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                🔑 Passwort zurücksetzen
              </a>
            </div>
            
            <div style="background: rgba(239, 68, 68, 0.2); padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h4 style="color: #fecaca; margin: 0 0 10px 0;">⚠️ Sicherheitshinweis</h4>
              <p style="color: #e5e7eb; margin: 0; font-size: 14px;">
                Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese Email. 
                Ihr Passwort bleibt unverändert. Der Link läuft in 1 Stunde ab.
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 25px;">
              Aus Sicherheitsgründen können Sie diesen Link nur einmal verwenden.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>🇨🇭 Made in Switzerland | Privacy-by-Design | Zero-Knowledge</p>
            <p>© ${new Date().getFullYear()} Stararc.one - Alle Rechte vorbehalten</p>
          </div>
        </div>
      `
    };

    await this.transporter.sendMail(mailOptions);
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