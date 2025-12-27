# 📧 E-Mail-Verifizierung für Stararc mit Hostpoint

## ✅ Was wurde implementiert

### Backend-Änderungen:

1. **EmailService** ([backend/src/services/emailService.ts](backend/src/services/emailService.ts))
   - ✅ Hostpoint SMTP-Konfiguration (asmtp.mail.hostpoint.ch, Port 587)
   - ✅ SMTP-Verbindungstest beim Start
   - ✅ Verbessertes Error-Handling und Logging
   - ✅ Stylische HTML-E-Mail-Templates
   - ✅ Verifizierungs-E-Mail mit 24h gültigem Token
   - ✅ Welcome-E-Mail nach erfolgreicher Verifizierung

2. **AuthService** ([backend/src/services/authService.ts](backend/src/services/authService.ts))
   - ✅ `email_verified` wird bei Registration auf `false` gesetzt
   - ✅ Benutzer müssen E-Mail verifizieren vor dem ersten Login

3. **Auth Routes** ([backend/src/routes/auth.ts](backend/src/routes/auth.ts))
   - ✅ Registration sendet Verifizierungs-E-Mail
   - ✅ Neuer Endpoint: `GET /api/auth/verify-email?token=xxx`
   - ✅ Verifikation setzt `email_verified = true`
   - ✅ Optionale Welcome-E-Mail nach Verifizierung

### Frontend-Änderungen:

4. **VerifyEmail Page** ([frontend/src/pages/VerifyEmail.tsx](frontend/src/pages/VerifyEmail.tsx))
   - ✅ Bereits vorhanden und funktionsfähig
   - ✅ Zeigt Verifizierungs-Status an
   - ✅ Automatische Weiterleitung zum Login nach Erfolg

### Deployment:

5. **Deployment Script** ([deploy-email-setup.sh](deploy-email-setup.sh))
   - ✅ Setzt alle Heroku Config Vars
   - ✅ Committed und pushed automatisch
   - ✅ Zeigt Logs zur Überwachung

---

## 🚀 Deployment-Anleitung

### Option 1: Automatisches Deployment (Empfohlen)

```bash
cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc
./deploy-email-setup.sh
```

Das Script macht folgendes:
1. Setzt alle Heroku Config Vars
2. Committed deine Änderungen
3. Pusht zu Heroku
4. Zeigt die Logs

### Option 2: Manuelles Deployment

Wenn du das Script nicht verwenden möchtest:

```bash
# 1. Heroku Config Vars setzen
heroku config:set SMTP_HOST=asmtp.mail.hostpoint.ch -a stararc
heroku config:set SMTP_PORT=587 -a stararc
heroku config:set SMTP_SECURE=false -a stararc
heroku config:set SMTP_USER=info@stararc.one -a stararc
heroku config:set SMTP_PASS=okMeddamoaHac5 -a stararc
heroku config:set FROM_EMAIL=info@stararc.one -a stararc
heroku config:set FRONTEND_URL=https://stararc.one -a stararc
heroku config:set NODE_ENV=production -a stararc

# 2. Config überprüfen
heroku config -a stararc

# 3. Code deployen
git add .
git commit -m "Add email verification with Hostpoint SMTP"
git push heroku main

# 4. Logs überwachen
heroku logs --tail -a stararc
```

---

## 🧪 Testing

### 1. Lokales Testing (ohne E-Mail-Versand)

```bash
# .env in backend/ erstellen
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=test@ethereal.email
SMTP_PASS=test
FROM_EMAIL=noreply@stararc.test
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Backend starten
cd backend
npm run dev

# Frontend starten (in neuem Terminal)
cd frontend
npm run dev
```

Im Development-Modus werden E-Mails über Ethereal Email simuliert und die Preview-URL wird im Backend-Log angezeigt.

### 2. Produktions-Testing auf Heroku

```bash
# 1. Registrierung testen
# Gehe zu: https://stararc.one/register
# Registriere dich mit einer echten E-Mail-Adresse

# 2. E-Mail-Eingang prüfen
# Prüfe deinen Posteingang (auch Spam-Ordner!)

# 3. Verifizierungs-Link klicken
# Der Link sollte wie folgt aussehen:
# https://stararc.one/verify-email?token=xxxxx

# 4. Logs überwachen
heroku logs --tail -a stararc | grep -E "(Email|SMTP|Verification)"

# Erfolgreiche E-Mail-Logs sollten aussehen wie:
# ✅ SMTP server ready to send emails via Hostpoint
# 📧 Sender: info@stararc.one
# ✅ Verification email sent to user@example.com
# 📧 Message ID: <xxxxx@stararc.one>
# ✅ Email verified for user ID: 123
```

---

## 📊 E-Mail-Flow

### Registration Flow:

```
1. Benutzer registriert sich
   └─> POST /api/auth/register
       └─> User in DB erstellen (email_verified = false)
       └─> Verifizierungs-Token generieren (24h gültig)
       └─> E-Mail an info@stararc.one senden
           └─> Hostpoint SMTP (asmtp.mail.hostpoint.ch)
           └─> E-Mail mit Verifizierungs-Link
       └─> Response: "Bitte bestätigen Sie Ihre E-Mail"

2. Benutzer erhält E-Mail
   └─> Stylische HTML-E-Mail mit:
       - Willkommenstext
       - "Email bestätigen" Button
       - 24h Ablauf-Hinweis
       - Privacy-by-Design Hinweise

3. Benutzer klickt Link
   └─> https://stararc.one/verify-email?token=xxxxx
       └─> Frontend: VerifyEmail.tsx
       └─> GET /api/auth/verify-email?token=xxxxx
           └─> Token prüfen (noch gültig?)
           └─> email_verified = true setzen
           └─> Token löschen
           └─> Welcome-E-Mail senden (optional)
       └─> Weiterleitung zu /login nach 3 Sekunden

4. Benutzer kann sich einloggen
   └─> POST /api/auth/login
       └─> Prüft: email_verified = true?
       └─> Login erfolgreich ✅
```

---

## 🔍 Wichtige Logs

### Erfolgreiche SMTP-Verbindung:
```
✅ SMTP server ready to send emails via Hostpoint
📧 Sender: info@stararc.one
```

### E-Mail erfolgreich gesendet:
```
✅ Verification email sent to user@example.com
📧 Message ID: <1234567890.xxx@stararc.one>
```

### E-Mail-Verifizierung erfolgreich:
```
✅ Email verified for user ID: 123
📧 Welcome email sent to user 123
```

### Fehler-Logs:
```
❌ SMTP connection failed: [Error details]
❌ Failed to send verification email: [Error details]
```

---

## 🛡️ Sicherheits-Features

- ✅ **Token-basierte Verifizierung**: Eindeutige, kryptografisch sichere Tokens
- ✅ **24h Ablauf**: Tokens sind nur 24 Stunden gültig
- ✅ **One-Time-Use**: Token wird nach Verwendung gelöscht
- ✅ **TLS-Verschlüsselung**: STARTTLS mit Port 587
- ✅ **Certificate Validation**: `rejectUnauthorized: true`
- ✅ **No-Reply Sender**: E-Mails von info@stararc.one
- ✅ **Privacy-by-Design**: Keine unnötigen Daten in E-Mails

---

## 📧 E-Mail-Templates

### 1. Verifizierungs-E-Mail
- **Betreff**: 🚀 Willkommen bei Stararc - Email bestätigen
- **Design**: Blau-Gradient mit Glasmorphismus
- **Button**: "✅ Email bestätigen"
- **Infos**: Privacy-by-Design Features
- **Ablauf**: 24 Stunden

### 2. Welcome-E-Mail (nach Verifizierung)
- **Betreff**: 🎉 Willkommen bei Stararc - Ihr Konto ist aktiviert!
- **Design**: Grün-Gradient (Erfolg)
- **Button**: "🔐 Jetzt einloggen"
- **Infos**: Feature-Übersicht

---

## ⚙️ Heroku Config Vars

Nach dem Deployment solltest du folgende Variablen in Heroku sehen:

```bash
heroku config -a stararc
```

**Erwartete Ausgabe:**
```
SMTP_HOST:       asmtp.mail.hostpoint.ch
SMTP_PORT:       587
SMTP_SECURE:     false
SMTP_USER:       info@stararc.one
SMTP_PASS:       okMeddamoaHac5
FROM_EMAIL:      info@stararc.one
FRONTEND_URL:    https://stararc.one
NODE_ENV:        production
```

---

## 🐛 Troubleshooting

### Problem: E-Mails werden nicht gesendet

**Lösung 1: SMTP-Verbindung prüfen**
```bash
heroku logs --tail -a stararc | grep SMTP
```

Erwartete Ausgabe:
```
✅ SMTP server ready to send emails via Hostpoint
```

Falls nicht:
- Prüfe Heroku Config Vars: `heroku config -a stararc`
- Prüfe Hostpoint SMTP-Zugangsdaten
- Teste manuell mit `telnet asmtp.mail.hostpoint.ch 587`

**Lösung 2: Hostpoint-Limits prüfen**
- Hostpoint hat möglicherweise Rate-Limits
- Prüfe im Hostpoint Control Panel

**Lösung 3: Firewall/Netzwerk**
- Stelle sicher, dass Heroku zu Hostpoint verbinden kann
- Port 587 muss offen sein

### Problem: E-Mails landen im Spam

**Lösung: SPF/DKIM Records prüfen**
- Stelle sicher, dass deine Domain korrekt konfiguriert ist
- Hostpoint sollte automatisch SPF/DKIM einrichten
- Prüfe DNS-Records:
  ```bash
  dig TXT stararc.one
  dig TXT _dmarc.stararc.one
  ```

### Problem: Verifizierungs-Link funktioniert nicht

**Lösung: Frontend-URL prüfen**
```bash
heroku config:get FRONTEND_URL -a stararc
```

Sollte sein: `https://stararc.one`

Falls falsch:
```bash
heroku config:set FRONTEND_URL=https://stararc.one -a stararc
```

---

## 📝 Nächste Schritte

1. **Deploy durchführen**: `./deploy-email-setup.sh`
2. **Test-Registrierung**: Mit echter E-Mail-Adresse registrieren
3. **E-Mail prüfen**: Verifizierungs-E-Mail sollte ankommen
4. **Link klicken**: Konto aktivieren
5. **Login testen**: Mit verifiziertem Konto einloggen

---

## 🎯 Fertig!

Nach dem Deployment hast du:
- ✅ Vollständige E-Mail-Verifizierung
- ✅ Stylische HTML-E-Mails
- ✅ Hostpoint SMTP Integration
- ✅ Sichere Token-basierte Verifizierung
- ✅ Welcome-E-Mail nach Aktivierung
- ✅ Production-ready Setup

**Starte jetzt das Deployment:**
```bash
cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc
./deploy-email-setup.sh
```
