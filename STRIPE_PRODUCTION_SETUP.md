# Stripe Production Setup Guide

## Aktuelle Konfiguration

**Test-Modus (Standard):**
- Auto-Aktivierung nach Checkout (kein Webhook erforderlich)
- Test Price IDs werden verwendet
- `STRIPE_MODE` nicht gesetzt oder = `test`

**Production-Modus:**
- Nur Webhook-basierte Aktivierung
- Live Price IDs werden verwendet
- `STRIPE_MODE` = `live`

## Schritt 1: Production Prices in Stripe Dashboard erstellen

### Login zu Stripe Dashboard
1. Gehe zu https://dashboard.stripe.com
2. Stelle sicher, dass du im **LIVE-Modus** bist (Toggle oben rechts)

### Erstelle die Products & Prices
Für jeden Plan (Spark, Core, Apex):

1. **Navigiere zu**: Products → Create product
2. **Produktdetails:**
   - Name: `Stararc [Plan Name]` (z.B. "Stararc Spark Plan")
   - Description: Beschreibung des Plans
   
3. **Pricing:**
   - Spark: $9.00 USD / month (recurring)
   - Core: $29.00 USD / month (recurring)
   - Apex: $199.00 USD / month (recurring)

4. **Nach dem Erstellen:**
   - Kopiere die **Price ID** (beginnt mit `price_...`)
   - Notiere sie für die Environment Variables

### Beispiel Price IDs (müssen durch deine ersetzt werden):
```
Spark Live:  price_XXXXXXXXXXXXX (ersetze diesen Wert)
Core Live:   price_YYYYYYYYYYYYY (ersetze diesen Wert)
Apex Live:   price_ZZZZZZZZZZZZZ (ersetze diesen Wert)
```

## Schritt 2: Webhook Endpoint erstellen

### Im Stripe Dashboard:
1. **Navigiere zu**: Developers → Webhooks
2. **Klicke auf**: "Add endpoint"
3. **Endpoint URL**: `https://www.stararc.one/api/stripe/webhook`
4. **Events auswählen**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Signing secret kopieren**: `whsec_...` (wird als STRIPE_WEBHOOK_SECRET benötigt)

## Schritt 3: Environment Variables auf Heroku setzen

### Test-Modus (aktuell):
```bash
heroku config:set STRIPE_MODE=test -a stararc-app
# Test Keys bleiben wie sie sind
```

### Production-Modus:
```bash
# Stripe Mode auf Live setzen
heroku config:set STRIPE_MODE=live -a stararc-app

# Live API Keys (ersetze mit deinen echten Keys)
heroku config:set STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXXXXX -a stararc-app
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_YYYYYYYYYYYYYYY -a stararc-app

# Live Price IDs für die 3 Plans
heroku config:set STRIPE_PRICE_SPARK_LIVE=price_AAAAAAAAAAA -a stararc-app
heroku config:set STRIPE_PRICE_CORE_LIVE=price_BBBBBBBBBBB -a stararc-app
heroku config:set STRIPE_PRICE_APEX_LIVE=price_CCCCCCCCCCC -a stararc-app
```

## Schritt 4: Migration ausführen

Die subscription_events Tabelle muss auf Heroku erstellt werden:

```bash
# Auf Heroku Postgres verbinden
heroku pg:psql -a stararc-app

# Migration ausführen
\i backend/database/migrations/production_changes/002_add_subscription_events.sql
```

Oder via Heroku CLI:
```bash
heroku pg:psql -a stararc-app < backend/database/migrations/production_changes/002_add_subscription_events.sql
```

## Schritt 5: Testen

### Test-Modus Test:
1. `STRIPE_MODE=test` setzen
2. Checkout durchführen
3. Subscription sollte **automatisch aktiviert** werden (ohne Webhook)

### Production-Modus Test:
1. `STRIPE_MODE=live` setzen
2. Checkout durchführen
3. Subscription wird **NICHT** automatisch aktiviert
4. Warte auf Webhook von Stripe
5. Überprüfe `subscription_events` Tabelle:
   ```sql
   SELECT * FROM subscription_events ORDER BY created_at DESC LIMIT 10;
   ```

## Schritt 6: Monitoring

### Event Log überprüfen:
```sql
-- Alle Events der letzten 24 Stunden
SELECT 
  event_type, 
  user_id, 
  plan_id, 
  processed, 
  processing_error,
  created_at 
FROM subscription_events 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Fehlerhafte Events
SELECT * FROM subscription_events 
WHERE processed = false OR processing_error IS NOT NULL;
```

### Heroku Logs überprüfen:
```bash
heroku logs --tail -a stararc-app | grep WEBHOOK
```

## Wichtige Unterschiede: Test vs. Production

| Feature | Test Mode | Production Mode |
|---------|-----------|-----------------|
| Auto-Activation | ✅ Ja (sofort) | ❌ Nein |
| Webhook erforderlich | ⚪ Optional | ✅ Zwingend |
| Price IDs | Test-IDs | Live-IDs |
| Echte Zahlungen | ❌ Nein | ✅ Ja |
| Stripe Dashboard | Test-Daten | Live-Daten |

## Rollback zu Test-Modus

Falls Probleme auftreten:
```bash
heroku config:set STRIPE_MODE=test -a stararc-app
```

## Support & Debugging

### Webhook nicht empfangen?
1. Überprüfe Webhook URL in Stripe Dashboard
2. Überprüfe Signing Secret: `heroku config:get STRIPE_WEBHOOK_SECRET -a stararc-app`
3. Teste mit Stripe CLI: `stripe listen --forward-to localhost:3004/api/stripe/webhook`

### Subscription nicht aktiviert?
1. Überprüfe `subscription_events` Tabelle auf Fehler
2. Überprüfe Heroku Logs: `heroku logs --tail -a stararc-app`
3. Überprüfe Webhook Events in Stripe Dashboard

### Falsche Price ID?
1. Überprüfe Environment Variables: `heroku config -a stararc-app | grep STRIPE`
2. Überprüfe ob Price IDs mit Live-Modus übereinstimmen
