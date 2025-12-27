#!/bin/bash
#
# Stararc Email Verification Setup Script
# Konfiguriert Hostpoint SMTP auf Heroku und deployt die Anwendung
#

set -e  # Exit on error

echo "📧 Stararc Email Verification Setup"
echo "===================================="
echo ""

# Hostpoint SMTP Configuration
SMTP_HOST="asmtp.mail.hostpoint.ch"
SMTP_PORT="587"
SMTP_SECURE="false"  # false for port 587 (STARTTLS)
SMTP_USER="info@stararc.one"
SMTP_PASS="okMeddamoaHac5"
FROM_EMAIL="info@stararc.one"
FRONTEND_URL="https://stararc.one"
NODE_ENV="production"

echo "🔧 Setting Heroku config vars..."
echo ""

# Set all environment variables at once for faster deployment
heroku config:set \
  SMTP_HOST="$SMTP_HOST" \
  SMTP_PORT="$SMTP_PORT" \
  SMTP_SECURE="$SMTP_SECURE" \
  SMTP_USER="$SMTP_USER" \
  SMTP_PASS="$SMTP_PASS" \
  FROM_EMAIL="$FROM_EMAIL" \
  FRONTEND_URL="$FRONTEND_URL" \
  NODE_ENV="$NODE_ENV" \
  -a stararc-app

echo ""
echo "✅ Config vars set successfully!"
echo ""
echo "📋 Current configuration:"
heroku config -a stararc-app | grep -E "(SMTP|FROM_EMAIL|FRONTEND_URL|NODE_ENV)"
echo ""

echo "🚀 Deploying to Heroku..."
echo ""

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
  echo "📝 Uncommitted changes found, committing..."
  git add .
  git commit -m "Add email verification with Hostpoint SMTP integration

- Configure Hostpoint SMTP (asmtp.mail.hostpoint.ch)
- Enable email verification on registration
- Add verify-email endpoint
- Improve email templates with better styling
- Add welcome email after verification
- Update EmailService with connection testing and error logging"
else
  echo "✅ No uncommitted changes"
fi

# Push to Heroku
echo ""
echo "🚢 Pushing to Heroku main branch..."
git push heroku main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Checking application logs..."
echo ""

# Show recent logs
heroku logs --tail --num 50 -a stararc-app &
LOGS_PID=$!

# Wait for 10 seconds to see startup logs
sleep 10

# Kill the logs process
kill $LOGS_PID 2>/dev/null || true

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "📧 Email Configuration:"
echo "  • SMTP Server: $SMTP_HOST"
echo "  • Port: $SMTP_PORT (STARTTLS)"
echo "  • From: $FROM_EMAIL"
echo "  • Frontend: $FRONTEND_URL"
echo ""
echo "🧪 Testing Registration:"
echo "  1. Go to: https://stararc.one/register"
echo "  2. Register with a real email address"
echo "  3. Check your inbox for verification email"
echo "  4. Click verification link"
echo "  5. Login at: https://stararc.one/login"
echo ""
echo "📊 Monitor logs:"
echo "  heroku logs --tail -a stararc-app"
echo ""
echo "🔍 Check config:"
echo "  heroku config -a stararc-app"
echo ""
