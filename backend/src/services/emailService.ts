import nodemailer from 'nodemailer';

export class EmailService {
  private transporter!: nodemailer.Transporter;
  private fromEmail: string;
  private ready: Promise<void>;

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
      this.ready = new Promise((resolve) => {
        this.transporter.verify((error, success) => {
          if (error) {
            console.error('❌ SMTP connection failed:', error);
            console.error('Check your Hostpoint SMTP credentials in environment variables');
          } else {
            console.log('✅ SMTP server ready to send emails via Hostpoint');
            console.log(`📧 Sender: ${this.fromEmail}`);
          }
          resolve();
        });
      });
    } else {
      // Development: Use Ethereal Email for testing (auto-generated account)
      this.ready = this.initEthereal();
    }
  }

  private async initEthereal(): Promise<void> {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('🧪 Development mode: Ethereal Email ready');
      console.log(`📧 Ethereal User: ${testAccount.user}`);
      console.log(`🌐 Ethereal Inbox: https://ethereal.email/login`);
      console.log(`   (Login: ${testAccount.user} / ${testAccount.pass})`);
    } catch (error) {
      console.error('❌ Failed to create Ethereal account, falling back to console logging:', error);
      // Fallback: create a stream transport that just logs
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
      });
    }
  }

  // Ensure transporter is ready before sending (needed for async Ethereal init)
  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  // Send admin notification for important user events
  async sendAdminNotification(subject: string, details: Record<string, any>): Promise<void> {
    await this.ensureReady();
    const adminEmail = 'info@stararc.one';
    
    // Format details as simple text lines
    const detailsHtml = Object.entries(details)
      .map(([key, value]) => `<p style="color: #4b5563; margin: 4px 0;"><strong>${key}:</strong> ${value}</p>`)
      .join('');

    const mailOptions = {
      from: this.fromEmail,
      to: adminEmail,
      subject: `Stararc Admin - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${subject}</h2>
          
          ${detailsHtml}
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent: ${subject}`);
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
      // Don't throw - admin notifications shouldn't break user flows
    }
  }

  // Send email verification (returns preview URL in dev mode)
  async sendEmailVerification(email: string, alias: string, verificationToken: string, language: string = 'de'): Promise<string | null> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const texts = {
      de: {
        subject: 'StarArc – E-Mail bestätigen',
        heading: 'E-Mail bestätigen',
        body: 'Bitte bestätige deine E-Mail-Adresse, um dein StarArc-Konto zu aktivieren:',
        button: 'E-Mail bestätigen',
        expiry: 'Der Link ist 24 Stunden gültig.',
        fallback: 'Falls der Button nicht funktioniert:'
      },
      en: {
        subject: 'StarArc – Confirm Email',
        heading: 'Confirm Email',
        body: 'Please confirm your email address to activate your StarArc account:',
        button: 'Confirm Email',
        expiry: 'This link is valid for 24 hours.',
        fallback: 'If the button doesn\'t work:'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${t.expiry}
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            ${t.fallback}<br>
            <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Verification email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      // In development, log and return preview URL
      if (process.env.NODE_ENV !== 'production') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`🔗 Preview URL: ${previewUrl}`);
        return previewUrl || null;
      }
      return null;
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send password reset email
  async sendPasswordReset(email: string, alias: string, resetToken: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const texts = {
      de: {
        subject: 'StarArc – Passwort zurücksetzen',
        heading: 'Passwort zurücksetzen',
        body: 'Klicke auf den Button, um ein neues Passwort zu erstellen:',
        button: 'Passwort zurücksetzen',
        expiry: 'Der Link ist 1 Stunde gültig. Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail.',
        fallback: 'Falls der Button nicht funktioniert:'
      },
      en: {
        subject: 'StarArc – Reset Password',
        heading: 'Reset Password',
        body: 'Click the button to create a new password:',
        button: 'Reset Password',
        expiry: 'This link is valid for 1 hour. If you didn\'t request this, please ignore this email.',
        fallback: 'If the button doesn\'t work:'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${t.expiry}
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            ${t.fallback}<br>
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
  async sendWelcomeEmail(email: string, alias: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;
    
    const texts = {
      de: {
        subject: 'Willkommen bei StarArc',
        heading: 'Willkommen bei StarArc',
        body: 'Dein Konto ist aktiviert. Du kannst dich jetzt einloggen und mit StarArc beginnen.',
        button: 'Jetzt einloggen',
      },
      en: {
        subject: 'Welcome to StarArc',
        heading: 'Welcome to StarArc',
        body: 'Your account is activated. You can now log in and start using StarArc.',
        button: 'Log in now'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${loginUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
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

  // Send 2FA enabled notification
  async send2FAEnabled(email: string, alias: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const texts = {
      de: {
        subject: 'StarArc – Zwei-Faktor-Authentifizierung aktiviert',
        heading: 'Zwei-Faktor-Authentifizierung aktiviert',
        body: 'Die Zwei-Faktor-Authentifizierung (2FA) wurde für dein StarArc-Konto aktiviert.',
        successTitle: '✓ Dein Konto ist jetzt besser geschützt',
        successBody: 'Bei jedem Login benötigst du zusätzlich zu deinem Passwort einen Code aus deiner Authenticator-App.',
        warningTitle: 'Wichtig:',
        warningBody: 'Bewahre deine Backup-Codes sicher auf! Du benötigst diese, falls du dein Gerät verlierst.',
        button: 'Zum Dashboard',
        notYou: 'Falls du dies nicht warst, kontaktiere uns sofort unter info@stararc.one'
      },
      en: {
        subject: 'StarArc – Two-Factor Authentication Enabled',
        heading: 'Two-Factor Authentication Enabled',
        body: 'Two-factor authentication (2FA) has been enabled for your StarArc account.',
        successTitle: '✓ Your account is now better protected',
        successBody: 'Each login will require a code from your authenticator app in addition to your password.',
        warningTitle: 'Important:',
        warningBody: 'Keep your backup codes safe! You\'ll need them if you lose your device.',
        button: 'Go to Dashboard',
        notYou: 'If this wasn\'t you, contact us immediately at info@stararc.one'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #10b981;">
            <p style="color: #065f46; line-height: 1.6; margin: 0;">
              <strong>${t.successTitle}</strong><br>
              ${t.successBody}
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>${t.warningTitle}</strong> ${t.warningBody}
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${t.notYou}
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ 2FA enabled email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send 2FA enabled email:', error);
      throw new Error('Failed to send 2FA enabled email');
    }
  }

  // Send 2FA disabled notification (security alert)
  async send2FADisabled(email: string, alias: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const changePasswordUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    const timestamp = new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' });
    
    const texts = {
      de: {
        subject: '⚠️ StarArc – Zwei-Faktor-Authentifizierung deaktiviert',
        heading: '⚠️ Zwei-Faktor-Authentifizierung deaktiviert',
        alertTitle: 'Sicherheitshinweis:',
        alertBody: 'Die Zwei-Faktor-Authentifizierung wurde für dein StarArc-Konto DEAKTIVIERT. Dein Konto ist jetzt weniger geschützt.',
        time: `Zeitpunkt: ${timestamp} (Schweizer Zeit)`,
        notYouTitle: 'Falls du dies nicht warst:',
        notYouBody: 'Dein Konto wurde möglicherweise kompromittiert. Ändere sofort dein Passwort und aktiviere 2FA erneut.',
        button: 'Passwort ändern',
        contact: 'Bei Fragen kontaktiere uns: info@stararc.one'
      },
      en: {
        subject: '⚠️ StarArc – Two-Factor Authentication Disabled',
        heading: '⚠️ Two-Factor Authentication Disabled',
        alertTitle: 'Security Notice:',
        alertBody: 'Two-factor authentication has been DISABLED for your StarArc account. Your account is now less protected.',
        time: `Time: ${timestamp} (Swiss Time)`,
        notYouTitle: 'If this wasn\'t you:',
        notYouBody: 'Your account may have been compromised. Change your password immediately and re-enable 2FA.',
        button: 'Change Password',
        contact: 'Questions? Contact us: info@stararc.one'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">${t.heading}</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #dc2626;">
            <p style="color: #991b1b; line-height: 1.6; margin: 0;">
              <strong>${t.alertTitle}</strong><br>
              ${t.alertBody}
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.time}
          </p>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>${t.notYouTitle}</strong><br>
              ${t.notYouBody}
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${changePasswordUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${t.contact}
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ 2FA disabled email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send 2FA disabled email:', error);
      throw new Error('Failed to send 2FA disabled email');
    }
  }

  // Send backup codes low warning
  async sendBackupCodesLowWarning(email: string, alias: string, remainingCodes: number, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const texts = {
      de: {
        subject: '⚠️ StarArc – Nur noch wenige Backup-Codes verfügbar',
        heading: '⚠️ Backup-Codes fast aufgebraucht',
        warningTitle: 'Achtung:',
        warningBody: `Du hast nur noch <strong>${remainingCodes} Backup-Code${remainingCodes !== 1 ? 's' : ''}</strong> für dein StarArc-Konto übrig.`,
        body: 'Um neue Backup-Codes zu erhalten, musst du die Zwei-Faktor-Authentifizierung deaktivieren und anschließend wieder aktivieren.',
        stepsTitle: 'So gehst du vor:',
        step1: 'Gehe zu den Sicherheitseinstellungen',
        step2: 'Deaktiviere 2FA (mit Passwort + 2FA-Code)',
        step3: 'Aktiviere 2FA erneut',
        step4: 'Du erhältst automatisch 10 neue Backup-Codes',
        button: 'Zu den Sicherheitseinstellungen',
        important: '<strong>Wichtig:</strong> Bewahre deine Backup-Codes an einem sicheren Ort auf. Sie werden nur bei der Einrichtung angezeigt.',
        contact: 'Bei Fragen kontaktiere uns: info@stararc.one'
      },
      en: {
        subject: '⚠️ StarArc – Few Backup Codes Remaining',
        heading: '⚠️ Backup Codes Almost Used Up',
        warningTitle: 'Warning:',
        warningBody: `You only have <strong>${remainingCodes} backup code${remainingCodes !== 1 ? 's' : ''}</strong> left for your StarArc account.`,
        body: 'To get new backup codes, you need to disable two-factor authentication and then re-enable it.',
        stepsTitle: 'How to proceed:',
        step1: 'Go to Security Settings',
        step2: 'Disable 2FA (with password + 2FA code)',
        step3: 'Re-enable 2FA',
        step4: 'You\'ll automatically receive 10 new backup codes',
        button: 'Go to Security Settings',
        important: '<strong>Important:</strong> Store your backup codes in a safe place. They are only shown during setup.',
        contact: 'Questions? Contact us: info@stararc.one'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #f59e0b; margin-bottom: 20px;">${t.heading}</h2>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>${t.warningTitle}</strong><br>
              ${t.warningBody}
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            ${t.body}
          </p>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #3b82f6;">
            <p style="color: #1e40af; line-height: 1.6; margin: 0;">
              <strong>${t.stepsTitle}</strong><br>
              1. ${t.step1}<br>
              2. ${t.step2}<br>
              3. ${t.step3}<br>
              4. ${t.step4}
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${t.important}
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            ${t.contact}
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Backup codes low warning email sent to ${email}`);
      console.log(`📧 Message ID: ${info.messageId}`);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send backup codes warning email:', error);
      throw new Error('Failed to send backup codes warning email');
    }
  }

  // Send subscription confirmation to user
  async sendSubscriptionConfirmation(email: string, alias: string, plan: string, isUpgrade: boolean = false, previousPlan?: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const texts = {
      de: {
        subjectUpgrade: `StarArc – Subscription Upgrade: ${previousPlan} → ${plan}`,
        subjectNew: `StarArc – ${plan}-Subscription aktiv`,
        headingUpgrade: 'Subscription Upgrade',
        headingNew: 'Subscription aktiviert',
        bodyUpgrade: `Dein Upgrade von ${previousPlan} auf ${plan} wurde erfolgreich durchgeführt.`,
        bodyNew: `Deine ${plan}-Subscription ist jetzt aktiv.`,
        button: 'Zum Dashboard'
      },
      en: {
        subjectUpgrade: `StarArc – Subscription Upgrade: ${previousPlan} → ${plan}`,
        subjectNew: `StarArc – ${plan} Subscription Active`,
        headingUpgrade: 'Subscription Upgrade',
        headingNew: 'Subscription Activated',
        bodyUpgrade: `Your upgrade from ${previousPlan} to ${plan} was successful.`,
        bodyNew: `Your ${plan} subscription is now active.`,
        button: 'Go to Dashboard'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: isUpgrade ? t.subjectUpgrade : t.subjectNew,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${isUpgrade ? t.headingUpgrade : t.headingNew}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${isUpgrade ? t.bodyUpgrade : t.bodyNew}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Subscription ${isUpgrade ? 'upgrade' : 'confirmation'} email sent to ${email}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send subscription email:', error);
    }
  }

  // Send detailed upgrade notification to user with proration/credit breakdown
  async sendUpgradeNotification(
    email: string,
    alias: string,
    previousPlan: string,
    newPlan: string,
    previousPriceYearly: number,
    newPriceYearly: number,
    creditAmount: number,
    chargedAmount: number,
    currency: string,
    language: string = 'de'
  ): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const formatAmount = (cents: number) => {
      const symbol = currency === 'usd' ? '$' : currency.toUpperCase() + ' ';
      return `${symbol}${(cents / 100).toFixed(2)}`;
    };

    const texts = {
      de: {
        subject: `StarArc – Upgrade: ${previousPlan} → ${newPlan}`,
        heading: 'Subscription Upgrade',
        body: `Dein Upgrade von <strong>${previousPlan}</strong> auf <strong>${newPlan}</strong> wurde erfolgreich durchgeführt.`,
        billingTitle: 'Abrechnungsdetails',
        prevPlan: `Bisheriger Plan (${previousPlan})`,
        newPlanLabel: `Neuer Plan (${newPlan})`,
        perYear: '/Jahr',
        credit: `Gutschrift ${previousPlan} (anteilig)`,
        charged: 'Sofort belastet',
        creditNote: `Die anteilige Gutschrift basiert auf der verbleibenden Laufzeit deiner ${previousPlan}-Subscription.`,
        button: 'Zum Dashboard'
      },
      en: {
        subject: `StarArc – Upgrade: ${previousPlan} → ${newPlan}`,
        heading: 'Subscription Upgrade',
        body: `Your upgrade from <strong>${previousPlan}</strong> to <strong>${newPlan}</strong> was successful.`,
        billingTitle: 'Billing Details',
        prevPlan: `Previous Plan (${previousPlan})`,
        newPlanLabel: `New Plan (${newPlan})`,
        perYear: '/year',
        credit: `Credit ${previousPlan} (prorated)`,
        charged: 'Charged now',
        creditNote: `The prorated credit is based on the remaining term of your ${previousPlan} subscription.`,
        button: 'Go to Dashboard'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            ${t.body}
          </p>
          
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 16px;">${t.billingTitle}</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; padding: 6px 0;">${t.prevPlan}</td>
                <td style="color: #6b7280; padding: 6px 0; text-align: right;">${formatAmount(previousPriceYearly)}${t.perYear}</td>
              </tr>
              <tr>
                <td style="color: #1f2937; padding: 6px 0; font-weight: 500;">${t.newPlanLabel}</td>
                <td style="color: #1f2937; padding: 6px 0; text-align: right; font-weight: 500;">${formatAmount(newPriceYearly)}${t.perYear}</td>
              </tr>
              ${creditAmount > 0 ? `
              <tr>
                <td colspan="2" style="padding: 12px 0 4px 0; border-top: 1px solid #e5e7eb;"></td>
              </tr>
              <tr>
                <td style="color: #059669; padding: 6px 0;">${t.credit}</td>
                <td style="color: #059669; padding: 6px 0; text-align: right;">-${formatAmount(creditAmount)}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #1f2937; padding: 12px 0 6px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">${t.charged}</td>
                <td style="color: #1f2937; padding: 12px 0 6px 0; text-align: right; font-weight: 600; border-top: 1px solid #e5e7eb;">${formatAmount(chargedAmount)}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            ${t.creditNote}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.button}
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Upgrade notification email sent to ${email}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send upgrade notification email:', error);
    }
  }

  // Send auth method selection confirmation to user
  async sendAuthMethodConfirmation(email: string, alias: string, authMethod: string, language: string = 'de'): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    const lang = language === 'en' ? 'en' : 'de';
    
    const isSovereignty = authMethod === 'password_zk';
    const methodLabel = isSovereignty ? 'Privacy Login' : 'Standard';

    const texts = {
      de: {
        subjectStandard: 'StarArc – Login-Methode eingerichtet',
        subjectSovereignty: 'StarArc – Privacy Login eingerichtet',
        heading: `Login-Methode: ${methodLabel}`,
        standardBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            Deine Login-Methode <strong>Standard</strong> wurde erfolgreich eingerichtet.
            Du kannst dich ab sofort mit deiner E-Mail und deinem Passwort anmelden.
          </p>
        `,
        sovereigntyBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
            Deine Login-Methode <strong>Privacy Login</strong> wurde erfolgreich eingerichtet.
            Du benötigst <strong>zwei Passwörter</strong> zum Einloggen:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; width: 140px; font-weight: 600; color: #1f2937;">StarArc</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">E-Mail + Passwort aus der Registrierung</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; color: #1f2937;">Finanzdaten</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Privacy-Login-Passwort (12 Zeichen), das du nach der Methodenwahl gesetzt hast</td>
            </tr>
          </table>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>⚠️ Wichtig:</strong> Das Privacy-Login-Passwort kann nur mit deiner <strong>6-Worte-Passphrase</strong> wiederhergestellt werden.
              Verwahre diese sicher – wir empfehlen mindestens <strong>zwei geografisch getrennte Backups</strong>.
            </p>
          </div>
        `,
        dashboard: 'Zum Dashboard'
      },
      en: {
        subjectStandard: 'StarArc – Login Method Configured',
        subjectSovereignty: 'StarArc – Privacy Login Configured',
        heading: `Login Method: ${methodLabel}`,
        standardBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            Your login method <strong>Standard</strong> has been successfully configured.
            You can now sign in with your email and password.
          </p>
        `,
        sovereigntyBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
            Your login method <strong>Privacy Login</strong> has been successfully configured.
            You need <strong>two passwords</strong> to sign in:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; width: 140px; font-weight: 600; color: #1f2937;">StarArc</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Email + password from registration</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; color: #1f2937;">Financial Data</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Privacy Login password (12 characters) set after choosing this method</td>
            </tr>
          </table>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>⚠️ Important:</strong> The Privacy Login password can only be recovered with your <strong>6-word passphrase</strong>.
              Store it securely – we recommend at least <strong>two geographically separate backups</strong>.
            </p>
          </div>
        `,
        dashboard: 'Go to Dashboard'
      }
    };

    const t = texts[lang];
    const subject = isSovereignty ? t.subjectSovereignty : t.subjectStandard;

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          ${isSovereignty ? t.sovereigntyBody : t.standardBody}
          
          <div style="margin: 24px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.dashboard}
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Auth method confirmation email sent to ${email}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send auth method email:', error);
    }
  }

  // Send welcome email on first Spaceship login (includes login method info)
  async sendFirstSpaceshipLogin(email: string, alias: string, language: string = 'de', loginMethod: string = 'password'): Promise<void> {
    await this.ensureReady();
    const lang = language === 'en' ? 'en' : 'de';
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const isSovereignty = loginMethod === 'password_zk';

    const texts = {
      de: {
        subject: 'Willkommen bei StarArc',
        heading: 'Willkommen bei StarArc',
        body: 'Dein Konto ist vollständig eingerichtet. Du kannst StarArc ab sofort in vollem Umfang nutzen.',
        loginMethodHeading: `Login-Methode: ${isSovereignty ? 'Privacy Login' : 'Standard'}`,
        standardBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            Du kannst dich mit deiner <strong>E-Mail und deinem Passwort</strong> anmelden.
          </p>
        `,
        sovereigntyBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
            Du benötigst <strong>zwei Passwörter</strong> zum Einloggen:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; width: 140px; font-weight: 600; color: #1f2937;">StarArc</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">E-Mail + Passwort aus der Registrierung</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; color: #1f2937;">Finanzdaten</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Privacy-Login-Passwort (12 Zeichen), das du nach der Methodenwahl gesetzt hast</td>
            </tr>
          </table>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>⚠️ Wichtig:</strong> Das Privacy-Login-Passwort kann nur mit deiner <strong>6-Worte-Passphrase</strong> wiederhergestellt werden.
              Verwahre diese sicher – wir empfehlen mindestens <strong>zwei geografisch getrennte Backups</strong>.
            </p>
          </div>
        `,
        dashboard: 'Zum Dashboard'
      },
      en: {
        subject: 'Welcome to StarArc',
        heading: 'Welcome to StarArc',
        body: 'Your account is fully set up. You can now use StarArc to its full extent.',
        loginMethodHeading: `Login Method: ${isSovereignty ? 'Privacy Login' : 'Standard'}`,
        standardBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
            You can sign in with your <strong>email and password</strong>.
          </p>
        `,
        sovereigntyBody: `
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
            You need <strong>two passwords</strong> to sign in:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; width: 140px; font-weight: 600; color: #1f2937;">StarArc</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Email + password from registration</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; color: #1f2937;">Financial Data</td>
              <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Privacy Login password (12 characters) set after choosing this method</td>
            </tr>
          </table>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
              <strong>⚠️ Important:</strong> The Privacy Login password can only be recovered with your <strong>6-word passphrase</strong>.
              Store it securely – we recommend at least <strong>two geographically separate backups</strong>.
            </p>
          </div>
        `,
        dashboard: 'Go to Dashboard'
      }
    };
    const t = texts[lang];

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${t.heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>

          <h3 style="color: #1f2937; margin-bottom: 12px; font-size: 16px;">${t.loginMethodHeading}</h3>
          ${isSovereignty ? t.sovereigntyBody : t.standardBody}
          
          <div style="margin: 24px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              ${t.dashboard}
            </a>
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
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
    }
  }
}