# Heroku US → EU Region Migration Plan

**Created:** 2 March 2026  
**Status:** Not started  
**Apps:** `stararc-app` + `spaceship-app`

> Heroku apps can't be moved between regions — you must create new apps in EU, transfer config/data/domains, then delete the old US apps.

---

## Phase 1: Preparation

- [ ] **Backup both databases locally**
  ```bash
  heroku pg:backups:capture -a stararc-app
  heroku pg:backups:download -a stararc-app -o stararc-backup.dump
  heroku pg:backups:capture -a spaceship-app
  heroku pg:backups:download -a spaceship-app -o spaceship-backup.dump
  ```

- [ ] **Export all config vars** from both apps
  ```bash
  heroku config -a stararc-app -s > stararc-config.env
  heroku config -a spaceship-app -s > spaceship-config.env
  ```

- [ ] **Note current addon details** (Postgres plan, any others)
  ```bash
  heroku addons -a stararc-app
  heroku addons -a spaceship-app
  heroku pg:info -a stararc-app
  heroku pg:info -a spaceship-app
  ```

---

## Phase 2: Create New EU Apps

- [ ] **Create new apps in EU region**
  ```bash
  heroku create stararc-eu --region eu
  heroku create spaceship-eu --region eu
  ```

- [ ] **Add Postgres addons** (match current plan tier)
  ```bash
  heroku addons:create heroku-postgresql:essential-0 -a stararc-eu
  heroku addons:create heroku-postgresql:essential-0 -a spaceship-eu
  ```

- [ ] **Restore databases** to new apps
  ```bash
  heroku pg:backups:restore stararc-backup.dump DATABASE_URL -a stararc-eu --confirm stararc-eu
  heroku pg:backups:restore spaceship-backup.dump DATABASE_URL -a spaceship-eu --confirm spaceship-eu
  ```

---

## Phase 3: Configure New Apps

- [ ] **Set all config vars** on new apps from exported files
  - Do NOT override `DATABASE_URL` (auto-set by new Postgres addon)
  - All shared secrets must be identical between apps:
    - `SPACESHIP_HMAC_SECRET`
    - `CROSS_APP_JWT_SECRET`
    - `INTERNAL_API_SECRET`
    - `JWT_SECRET`

- [ ] **Update cross-app URL references** in config vars

  | Variable | Old Value | New Value |
  |----------|-----------|-----------|
  | `VITE_STARSHIP_API_URL` (stararc) | `https://spaceship-app-05fdc7b20f43.herokuapp.com` | New spaceship-eu Heroku URL |
  | `SPACESHIP_URL` (stararc) | `https://spaceship.stararc.one` | Same (custom domain) |
  | `STARARC_API_URL` (spaceship) | `https://stararc.one` | Same (custom domain) |

---

## Phase 4: Deploy Code

- [ ] **Add new Heroku remotes and push code**
  ```bash
  cd stararc && heroku git:remote -a stararc-eu -r heroku-eu && git push heroku-eu main
  cd spaceship && heroku git:remote -a spaceship-eu -r heroku-eu && git push heroku-eu main
  ```

- [ ] **Verify builds succeed** and apps start on new EU dynos

---

## Phase 5: Domain Migration (Short Downtime ~5-30 min)

> Do this during off-peak hours!

- [ ] **Remove custom domains from old apps**
  ```bash
  heroku domains:remove stararc.one -a stararc-app
  heroku domains:remove www.stararc.one -a stararc-app
  heroku domains:remove spaceship.stararc.one -a spaceship-app
  ```

- [ ] **Add custom domains to new EU apps**
  ```bash
  heroku domains:add stararc.one -a stararc-eu
  heroku domains:add www.stararc.one -a stararc-eu
  heroku domains:add spaceship.stararc.one -a spaceship-eu
  ```

- [ ] **Update DNS records** at domain registrar with new CNAME values from Heroku

- [ ] **Enable SSL** (Heroku ACM auto-provisions after DNS propagation)
  ```bash
  heroku certs:auto:enable -a stararc-eu
  heroku certs:auto:enable -a spaceship-eu
  ```

---

## Phase 6: Update Code References

- [ ] **Update hardcoded Heroku URLs** in codebase (old `*-e576e504324e.herokuapp.com` / `*-05fdc7b20f43.herokuapp.com`):
  - `stararc/frontend/.env.production` — `VITE_API_URL`
  - `stararc/backend/src/app.ts` — CORS allowed origins
  - `spaceship/backend/.env.production`
  - Any other files referencing old Heroku URLs

- [ ] **Redeploy** both apps after URL updates

---

## Phase 7: Verify & Cleanup

- [ ] **Test everything:**
  - Auth flow (login, register, email verification)
  - Cross-app navigation (StarArc ↔ Spaceship)
  - Stripe webhooks and payments
  - Email sending (SMTP via Hostpoint)
  - Database operations (CRUD, encryption/decryption)
  - Latency improvement from EU

- [ ] **Update Stripe webhook endpoints** in Stripe Dashboard if they point to old Heroku URLs

- [ ] **Verify region:**
  ```bash
  heroku info -a stararc-eu    # Should show Region: eu
  heroku info -a spaceship-eu  # Should show Region: eu
  ```

- [ ] **Delete old US apps** (only after everything confirmed working!)
  ```bash
  heroku apps:destroy stararc-app --confirm stararc-app
  heroku apps:destroy spaceship-app --confirm spaceship-app
  ```

- [ ] **(Optional) Rename EU apps** to original names
  ```bash
  heroku apps:rename stararc-app -a stararc-eu
  heroku apps:rename spaceship-app -a spaceship-eu
  ```

---

## Notes

- **Downtime:** Steps in Phase 5 cause ~5-30 min downtime depending on DNS propagation
- **App names:** Using temporary names (`stararc-eu`) is safer — rename after old apps are deleted
- **Database plan:** Match current Postgres plan tier (check with `heroku pg:info`)
- **Stripe:** Webhook endpoints must be updated if they use `*.herokuapp.com` URLs
- **SMTP:** Hostpoint SMTP (`asmtp.mail.hostpoint.ch`) is independent of Heroku region — no change needed
