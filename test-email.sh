#!/bin/bash
#
# Quick Email Test Script
# Testet die E-Mail-Funktionalität lokal
#

echo "📧 Stararc Email Test"
echo "===================="
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
  echo "⚠️  backend/.env nicht gefunden. Erstelle Template..."
  cat > backend/.env << 'EOF'
# Hostpoint SMTP Configuration (für lokale Tests)
SMTP_HOST=asmtp.mail.hostpoint.ch
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@stararc.one
SMTP_PASS=okMeddamoaHac5
FROM_EMAIL=info@stararc.one
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Oder für Test ohne echte E-Mails (Ethereal):
# SMTP_HOST=smtp.ethereal.email
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=test@ethereal.email
# SMTP_PASS=test
# FROM_EMAIL=noreply@stararc.test
# FRONTEND_URL=http://localhost:3000
# NODE_ENV=development
EOF
  echo "✅ backend/.env erstellt"
  echo ""
fi

echo "🔍 Aktuelle SMTP-Konfiguration:"
echo ""
grep -E "^SMTP_|^FROM_EMAIL|^FRONTEND_URL" backend/.env || echo "Keine SMTP-Config gefunden"
echo ""

echo "🚀 Möchtest du:"
echo "  1) Backend starten (mit SMTP-Test)"
echo "  2) Heroku Logs anzeigen"
echo "  3) Heroku Config anzeigen"
echo "  4) Deployment durchführen"
echo "  5) Exit"
echo ""
read -p "Wähle (1-5): " choice

case $choice in
  1)
    echo ""
    echo "🔧 Starte Backend..."
    cd backend && npm run dev
    ;;
  2)
    echo ""
    echo "📊 Heroku Logs (SMTP/Email)..."
    heroku logs --tail -a stararc | grep -E "(SMTP|Email|Verification|📧|✅|❌)"
    ;;
  3)
    echo ""
    echo "⚙️  Heroku Config:"
    heroku config -a stararc | grep -E "(SMTP|FROM_EMAIL|FRONTEND_URL|NODE_ENV)"
    ;;
  4)
    echo ""
    ./deploy-email-setup.sh
    ;;
  5)
    echo "👋 Bye!"
    exit 0
    ;;
  *)
    echo "❌ Ungültige Eingabe"
    exit 1
    ;;
esac
