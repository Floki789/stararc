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
  async sendEmailVerification(email: string, alias: string, verificationToken: string): Promise<string | null> {
    await this.ensureReady();
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
  async sendPasswordReset(email: string, alias: string, resetToken: string): Promise<void> {
    await this.ensureReady();
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
    await this.ensureReady();
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

  // Send 2FA enabled notification
  async send2FAEnabled(email: string, alias: string): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Zwei-Faktor-Authentifizierung aktiviert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Zwei-Faktor-Authentifizierung aktiviert</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Die Zwei-Faktor-Authentifizierung (2FA) wurde für Ihr Stararc-Konto aktiviert.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #10b981;">
            <p style="color: #065f46; line-height: 1.6; margin: 0;">
              <strong>✓ Ihr Konto ist jetzt besser geschützt</strong><br>
              Bei jedem Login benötigen Sie zusätzlich zu Ihrem Passwort einen Code aus Ihrer Authenticator-App.
            </p>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>Wichtig:</strong> Bewahren Sie Ihre Backup-Codes sicher auf! 
              Sie benötigen diese, falls Sie Ihr Gerät verlieren.
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Zum Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Falls Sie dies nicht waren, kontaktieren Sie uns sofort unter info@stararc.one
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
  async send2FADisabled(email: string, alias: string): Promise<void> {
    await this.ensureReady();
    const changePasswordUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: '⚠️ Zwei-Faktor-Authentifizierung deaktiviert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">⚠️ Zwei-Faktor-Authentifizierung deaktiviert</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #dc2626;">
            <p style="color: #991b1b; line-height: 1.6; margin: 0;">
              <strong>Sicherheitshinweis:</strong><br>
              Die Zwei-Faktor-Authentifizierung wurde für Ihr Stararc-Konto DEAKTIVIERT.
              Ihr Konto ist jetzt weniger geschützt.
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Zeitpunkt: ${new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })} (Schweizer Zeit)
          </p>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>Falls Sie dies nicht waren:</strong><br>
              Ihr Konto wurde möglicherweise kompromittiert. 
              Ändern Sie sofort Ihr Passwort und aktivieren Sie 2FA erneut.
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${changePasswordUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Passwort ändern
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Bei Fragen kontaktieren Sie uns: info@stararc.one
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
  async sendBackupCodesLowWarning(email: string, alias: string, remainingCodes: number): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: '⚠️ Nur noch wenige Backup-Codes verfügbar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #f59e0b; margin-bottom: 20px;">⚠️ Backup-Codes fast aufgebraucht</h2>
          
          <div style="background: #fff7ed; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #f59e0b;">
            <p style="color: #92400e; line-height: 1.6; margin: 0;">
              <strong>Achtung:</strong><br>
              Sie haben nur noch <strong>${remainingCodes} Backup-Code${remainingCodes !== 1 ? 's' : ''}</strong> für Ihr Stararc-Konto übrig.
            </p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Um neue Backup-Codes zu erhalten, müssen Sie die Zwei-Faktor-Authentifizierung deaktivieren und anschließend wieder aktivieren.
          </p>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 3px solid #3b82f6;">
            <p style="color: #1e40af; line-height: 1.6; margin: 0;">
              <strong>So gehen Sie vor:</strong><br>
              1. Gehen Sie zu den Sicherheitseinstellungen<br>
              2. Deaktivieren Sie 2FA (mit Passwort + 2FA-Code)<br>
              3. Aktivieren Sie 2FA erneut<br>
              4. Sie erhalten automatisch 10 neue Backup-Codes
            </p>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Zu den Sicherheitseinstellungen
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Wichtig:</strong> Bewahren Sie Ihre Backup-Codes an einem sicheren Ort auf. 
            Sie werden nur bei der Einrichtung angezeigt.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            Bei Fragen kontaktieren Sie uns: info@stararc.one
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
  async sendSubscriptionConfirmation(email: string, alias: string, plan: string, isUpgrade: boolean = false, previousPlan?: string): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const subject = isUpgrade 
      ? `Stararc - Subscription Upgrade: ${previousPlan} → ${plan}`
      : `Stararc - ${plan}-Subscription aktiv`;
    
    const heading = isUpgrade
      ? `Subscription Upgrade`
      : `Subscription aktiviert`;
    
    const bodyText = isUpgrade
      ? `Dein Upgrade von ${previousPlan} auf ${plan} wurde erfolgreich durchgeführt.`
      : `Deine ${plan}-Subscription ist jetzt aktiv.`;

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">${heading}</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            ${bodyText}
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Zum Dashboard
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
    previousPriceYearly: number, // in cents
    newPriceYearly: number,      // in cents
    creditAmount: number,        // in cents (positive = credited from old plan)
    chargedAmount: number,       // in cents (net amount charged now)
    currency: string
  ): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const formatAmount = (cents: number) => {
      const symbol = currency === 'usd' ? '$' : currency.toUpperCase() + ' ';
      return `${symbol}${(cents / 100).toFixed(2)}`;
    };

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: `Stararc - Upgrade: ${previousPlan} → ${newPlan}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Subscription Upgrade</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Dein Upgrade von <strong>${previousPlan}</strong> auf <strong>${newPlan}</strong> wurde erfolgreich durchgeführt.
          </p>
          
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #374151; margin: 0 0 16px 0; font-size: 16px;">Abrechnungsdetails</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; padding: 6px 0;">Bisheriger Plan (${previousPlan})</td>
                <td style="color: #6b7280; padding: 6px 0; text-align: right;">${formatAmount(previousPriceYearly)}/Jahr</td>
              </tr>
              <tr>
                <td style="color: #1f2937; padding: 6px 0; font-weight: 500;">Neuer Plan (${newPlan})</td>
                <td style="color: #1f2937; padding: 6px 0; text-align: right; font-weight: 500;">${formatAmount(newPriceYearly)}/Jahr</td>
              </tr>
              ${creditAmount > 0 ? `
              <tr>
                <td colspan="2" style="padding: 12px 0 4px 0; border-top: 1px solid #e5e7eb;"></td>
              </tr>
              <tr>
                <td style="color: #059669; padding: 6px 0;">Gutschrift ${previousPlan} (anteilig)</td>
                <td style="color: #059669; padding: 6px 0; text-align: right;">-${formatAmount(creditAmount)}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #1f2937; padding: 12px 0 6px 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Sofort belastet</td>
                <td style="color: #1f2937; padding: 12px 0 6px 0; text-align: right; font-weight: 600; border-top: 1px solid #e5e7eb;">${formatAmount(chargedAmount)}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Die anteilige Gutschrift basiert auf der verbleibenden Laufzeit deiner ${previousPlan}-Subscription.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Zum Dashboard
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
  async sendAuthMethodConfirmation(email: string, alias: string, authMethod: string): Promise<void> {
    await this.ensureReady();
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    const isSovereignty = authMethod === 'password_zk';
    const methodLabel = isSovereignty ? 'Sovereignty' : 'Standard';
    const subject = isSovereignty 
      ? 'StarArc – Sovereignty Login eingerichtet' 
      : 'StarArc – Login-Methode eingerichtet';

    const standardBody = `
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
        Deine Login-Methode <strong>Standard</strong> wurde erfolgreich eingerichtet.
        Du kannst dich ab sofort mit deiner E-Mail und deinem Passwort anmelden.
      </p>
    `;

    const sovereigntyBody = `
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 16px;">
        Deine Login-Methode <strong>Sovereignty</strong> wurde erfolgreich eingerichtet.
        Du benötigst <strong>zwei Passwörter</strong> zum Einloggen:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; width: 140px; font-weight: 600; color: #1f2937;">StarArc</td>
          <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">E-Mail + Passwort aus der Registrierung</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: 600; color: #1f2937;">Finanzdaten</td>
          <td style="padding: 12px 16px; border: 1px solid #e5e7eb; color: #4b5563;">Sovereignty-Passwort (12 Zeichen), das du nach der Methodenwahl gesetzt hast</td>
        </tr>
      </table>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 4px;">
        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
          <strong>⚠️ Wichtig:</strong> Das Sovereignty-Passwort kann nur mit deiner <strong>6-Worte-Passphrase</strong> wiederhergestellt werden.
          Verwahre diese sicher – wir empfehlen mindestens <strong>zwei geografisch getrennte Backups</strong>.
        </p>
      </div>
    `;

    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Login-Methode: ${methodLabel}</h2>
          
          ${isSovereignty ? sovereigntyBody : standardBody}
          
          <div style="margin: 24px 0;">
            <a href="${dashboardUrl}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 500;">
              Zum Dashboard
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

  // Send first Spaceship login notification to user
  async sendFirstSpaceshipLogin(email: string, alias: string): Promise<void> {
    await this.ensureReady();
    const mailOptions = {
      from: this.fromEmail,
      to: email,
      subject: 'Stararc - Erster Login in Spaceship',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Willkommen in Spaceship</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Du hast dich zum ersten Mal in Stararc Spaceship eingeloggt. 
            Spaceship ist die sichere Asset-Management-Plattform von Stararc.
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            Du kannst Spaceship jederzeit über dein Stararc Dashboard starten.
          </p>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            © ${new Date().getFullYear()} Stararc.one
          </p>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ First Spaceship login email sent to ${email}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🔗 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Failed to send first Spaceship login email:', error);
    }
  }
}