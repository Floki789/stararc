# Heroku US → EU Region Migration Plan

**Created:** 2 March 2026  
**Updated:** 14 March 2026  
**Status:** Ready to execute  
**Apps:** `stararc-app` + `spaceship-app` (US) → `stararc` + `spaceship` (EU)

> **Entscheidung:** Essential-0 Postgres ($10/Monat für beide Apps)  
> **Erwarteter Gewinn:** 75% Latenz-Reduktion (150-200ms → 20-50ms für CH/EU)

> Heroku apps can't be moved between regions — you must create new apps in EU, transfer config/data/domains, then delete the old US apps.

---

## Phase 1: Backups erstellen (~10 Minuten)

**Zeitpunkt:** Jederzeit (keine Downtime)

- [ ] **Datenbank-Backups erstellen**
  ```bash
  # Backups triggern
  heroku pg:backups:capture -a spaceship-app
  heroku pg:backups:capture -a stararc-app
  
  # Lokal herunterladen (mit Datum im Dateinamen)
  heroku pg:backups:download -a spaceship-app -o spaceship-backup-20260314.dump
  heroku pg:backups:download -a stararc-app -o stararc-backup-20260314.dump
  ```

- [ ] **Config Vars exportieren**
  ```bash
  heroku config -a spaceship-app -s > spaceship-config-20260314.env
  heroku config -a stararc-app -s > stararc-config-20260314.env
  ```

- [ ] **Aktuelle Addon-Info notieren**
  ```bash
  heroku addons -a spaceship-app
  heroku addons -a stararc-app
  heroku pg:info -a spaceship-app
  heroku pg:info -a stararc-app
  ```

---

## Phase 2: EU-Apps erstellen (~5 Minuten)

**Zeitpunkt:** Jederzeit (keine Downtime)

- [ ] **Apps in EU-Region erstellen**
  ```bash
  # Finale Namen (kein -eu Suffix nötig, da spaceship ≠ spaceship-app)
  heroku create spaceship --region eu
  heroku create stararc --region eu
  
  # Region verifizieren
  heroku info -a spaceship | grep Region    # → eu
  heroku info -a stararc | grep Region      # → eu
  ```

- [ ] **Essential-0 Postgres hinzufügen**
  ```bash
  heroku addons:create heroku-postgresql:essential-0 -a spaceship
  heroku addons:create heroku-postgresql:essential-0 -a stararc
  
  # Warten bis provisioniert
  heroku addons:wait -a spaceship
  heroku addons:wait -a stararc
  ```
  
  **Kosten:** $5/Monat pro App = **$10/Monat total**

- [ ] **Datenbanken wiederherstellen**
  ```bash
  heroku pg:backups:restore spaceship-backup-20260314.dump DATABASE_URL -a spaceship --confirm spaceship
  heroku pg:backups:restore stararc-backup-20260314.dump DATABASE_URL -a stararc --confirm stararc
  ```

---

## Phase 3: Konfiguration (~10 Minuten)

**Zeitpunkt:** Jederzeit (keine Downtime)

- [ ] **Alle Config Vars setzen**
  
  **Wichtig:** Diese 4 Secrets MÜSSEN zwischen beiden Apps identisch sein:
  - `CROSS_APP_JWT_SECRET`
  - `SPACESHIP_HMAC_SECRET`
  - `INTERNAL_API_SECRET`
  - `JWT_SECRET`
  
  Verwende die Werte aus `SECRETS_BACKUP.txt` (v240)!

  ```bash
  # Config vars einzeln setzen oder batch via heroku config:set
  # NICHT DATABASE_URL überschreiben (wird automatisch gesetzt)
  ```

- [ ] **Cross-App URLs aktualisieren**
  
  | Variable | Wert |
  |----------|------|
  | `VITE_STARSHIP_API_URL` (stararc) | Neue spaceship Heroku URL |
  | `SPACESHIP_URL` (stararc) | `https://spaceship.stararc.one` |
  | `STARARC_API_URL` (spaceship) | `https://stararc.one` |

- [ ] **Backup Schedule einrichten**
  ```bash
  # Tägliche Backups um 02:00 Schweizer Zeit
  heroku pg:backups:schedule DATABASE_URL --at "02:00 Europe/Zurich" -a spaceship
  heroku pg:backups:schedule DATABASE_URL --at "02:00 Europe/Zurich" -a stararc
  
  # Retention auf 2 Wochen setzen
  heroku pg:backups:retention DATABASE_URL --weeks 2 -a spaceship
  heroku pg:backups:retention DATABASE_URL --weeks 2 -a stararc
  ```

- [ ] **Preboot aktivieren** (Zero-Downtime Deployments)
  ```bash
  heroku features:enable preboot -a spaceship
  heroku features:enable preboot -a stararc
  ```

---

## Phase 4: Code deployen (~10 Minuten)

**Zeitpunkt:** Jederzeit (keine Downtime)

- [ ] **Git Remotes hinzufügen**
  ```bash
  # Spaceship
  cd /Users/sam/mydata/MyApps/ArchimedesApps/spaceship
  heroku git:remote -a spaceship
  
  # StarArc
  cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc
  heroku git:remote -a stararc
  ```

- [ ] **Code pushen**
  ```bash
  # Spaceship
  cd /Users/sam/mydata/MyApps/ArchimedesApps/spaceship
  git push heroku main
  
  # StarArc
  cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc
  git push heroku main
  ```

- [ ] **Build-Logs prüfen**
  ```bash
  heroku logs --tail -a spaceship
  heroku logs --tail -a stararc
  ```

- [ ] **Apps testen** (via Heroku URLs)
  ```bash
  heroku open -a spaceship
  heroku open -a stararc
  ```

---

## Phase 5: Domain-Migration (~10-30 Minuten DOWNTIME)

**⚠️ WICHTIG:** Während der Off-Peak-Zeit ausführen!

- [ ] **Domains von alten Apps entfernen**
  ```bash
  heroku domains:remove spaceship.stararc.one -a spaceship-app
  heroku domains:remove stararc.one -a stararc-app
  heroku domains:remove www.stararc.one -a stararc-app
  ```

- [ ] **Domains zu neuen Apps hinzufügen**
  ```bash
  heroku domains:add spaceship.stararc.one -a spaceship
  heroku domains:add stararc.one -a stararc
  heroku domains:add www.stararc.one -a stararc
  ```

- [ ] **Neue CNAME-Werte notieren**
  ```bash
  heroku domains -a spaceship
  heroku domains -a stararc
  ```

- [ ] **DNS bei Domain-Registrar aktualisieren**
  - Alte CNAME-Einträge durch neue ersetzen
  - TTL: 300 Sekunden (5 Minuten) für schnelle Propagation

- [ ] **SSL aktivieren**
  ```bash
  heroku certs:auto:enable -a spaceship
  heroku certs:auto:enable -a stararc
  ```
  
  (ACM wird automatisch nach DNS-Propagation provisioniert)

---

## Phase 6: Verification (~15 Minuten)

**Zeitpunkt:** Direkt nach Phase 5

- [ ] **DNS-Propagation prüfen**
  ```bash
  dig spaceship.stararc.one
  dig stararc.one
  dig www.stararc.one
  ```

- [ ] **HTTPS-Zugriff testen**
  - https://spaceship.stararc.one
  - https://stararc.one
  - https://www.stararc.one

- [ ] **Funktionstest**
  - ✅ Login als bestehender User
  - ✅ Neuer User registrieren
  - ✅ Email-Verification
  - ✅ Cross-App Navigation (StarArc → Spaceship)
  - ✅ Asset-Anzeige (Verschlüsselung funktioniert)
  - ✅ Stripe Payment Test
  - ✅ Latenz messen (sollte ~20-50ms sein)

- [ ] **Database Integrity prüfen**
  ```bash
  heroku pg:psql -a spaceship -c "SELECT COUNT(*) FROM users;"
  heroku pg:psql -a stararc -c "SELECT COUNT(*) FROM users;"
  ```

- [ ] **Region-Check**
  ```bash
  heroku info -a spaceship | grep Region    # → eu
  heroku info -a stararc | grep Region      # → eu
  ```

---

## Phase 7: Cleanup (~5 Minuten)

**⚠️ NUR nach 24+ Stunden stabiler Operation!**

- [ ] **Alte Apps löschen**
  ```bash
  heroku apps:destroy spaceship-app --confirm spaceship-app
  heroku apps:destroy stararc-app --confirm stararc-app
  ```

- [ ] **Git Remotes aufräumen**
  ```bash
  # Alte remotes entfernen (falls vorhanden)
  cd /Users/sam/mydata/MyApps/ArchimedesApps/spaceship
  git remote remove heroku-old
  
  cd /Users/sam/mydata/MyApps/ArchimedesApps/stararc
  git remote remove heroku-old
  ```

---

## 🔄 Rollback-Plan

Falls Probleme in Phase 5:

1. **DNS zurücksetzen** auf alte Heroku CNAMEs
2. **Alte Apps bleiben verfügbar** bis Phase 7
3. **Datenbank-Backups lokal gespeichert** für Restore

---

## 💡 Upgrade-Pfad zu Essential-1

Falls später mehr Performance benötigt:

```bash
# Jederzeit ohne Downtime upgraden
heroku addons:upgrade heroku-postgresql:essential-1 -a spaceship
heroku addons:upgrade heroku-postgresql:essential-1 -a stararc
```

**Kosten:** +$4/Monat pro App (total $18/Monat statt $10/Monat)  
**Vorteile:** 4x RAM (4GB), 2x Connections (40)

---

## 📊 Erwartete Verbesserungen

- **Latenz:** 150-200ms → 20-50ms (75% Reduktion) für CH/EU-User
- **GDPR:** Daten in EU-Region (Irland)
- **Sauberkeit:** App-Namen = Localhost-Namen (spaceship, stararc)
- **Kosten:** Identisch ($10/Monat, Essential-0)

---

## ⏱️ Gesamtdauer

- **Phase 1-4:** ~35 Minuten (ohne Downtime, während Geschäftszeiten möglich)
- **Phase 5:** ~10-30 Minuten **DOWNTIME** (Off-Peak!)
- **Phase 6:** ~15 Minuten (Testing)
- **Phase 7:** Nach 24h (~5 Minuten)

**Total:** ~1 Stunde Arbeit, ~20 Minuten Downtime

---

**Status:** ⏸️ Bereit für Execution am 14. März 2026
