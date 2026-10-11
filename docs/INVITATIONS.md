# Registrierung auf Einladung

Neue Registrierungen benötigen eine persönlich freigegebene Einladung. Es gibt keinen allgemeinen Standardcode und keinen automatischen offenen Registrierungsmodus.

## Einrichtung vor dem Deployment

1. `INVITATION_ADMIN_EMAIL` auf die E-Mail-Adresse des bereits bestehenden, verifizierten Eigentümerkontos setzen. Ohne diesen Wert wird `ADMIN_EMAIL`, danach `info@stararc.one` verwendet. An diese Adresse werden neue Zugangsanfragen gesendet. Verifizierte Konten mit Datenbankrolle `admin` dürfen ebenfalls Einladungen verwalten.
2. `FRONTEND_URL` auf die öffentliche Adresse setzen. Die bestehende SMTP-Konfiguration wird für Benachrichtigungen und Einladungen verwendet.
3. Auf Heroku führt die Release-Phase die Migration vor dem Start der neuen Anwendung automatisch aus. Bei anderen Deployments mit der Zieldatenbank in `DATABASE_URL` vor dem Start ausführen:

   ```bash
   npm run migrate:invitations --workspace=backend
   ```

   Die Migration `backend/database/migrations/022_invitation_access.sql` ist wiederholbar und ändert bestehende Nutzer nicht. Der bisherige Migrationsrunner führt diese Datei nicht automatisch aus.

## Bedienung

- Interessenten öffnen `/request-access`. Name und E-Mail sind erforderlich, eine Nachricht ist optional. Die Angaben werden verschlüsselt gespeichert. Doppelte Anfragen erzeugen keine zusätzlichen Benachrichtigungen.
- Der Eigentümer erhält eine E-Mail mit einem Link auf `/admin/invitations`. Die Seite erfordert eine Anmeldung und die oben beschriebene Berechtigung. Sie ist auch über „Einladungen verwalten“ im Dashboard erreichbar.
- „Freigeben und einladen“ versendet einen persönlichen Link und einen kurzen Code wie `NOVA-4827`. Direkte Einladungen ohne vorherige Anfrage sind ebenfalls möglich.
- Die eingeladene Person kann den Link anklicken oder den Code unter `/register` eingeben. Die Einladung gilt nur für die freigegebene E-Mail-Adresse und einmalig für 14 Tage. Nach der Registrierung bleibt die bestehende E-Mail-Verifizierung erforderlich.
- „Widerrufen“ sperrt eine offene Einladung sofort. „Neue Einladung senden“ ersetzt die bisherigen Zugangsdaten, setzt die Fehlversuche zurück und beginnt neue 14 Tage. Abgelehnte Anfragen können später freigegeben werden.
- Scheitert der Versand einer Einladung, bleibt sie gültig; die Verwaltung zeigt den Link und Code zum manuellen Versenden. Ein erneuter Versand erstellt neue Zugangsdaten.
- Scheitert die Admin-Benachrichtigung, bleibt die Anfrage in der Verwaltung erhalten. Für nicht freigegebene Anfragen gibt es keine automatische Erinnerungs-E-Mail.

## Schutz und Verhalten

Codes und Link-Token werden nur als Hash gespeichert. Der lange Link-Token steht im URL-Fragment und wird nach dem Einlesen aus der Browseradresse entfernt. Der kurze Code besteht aus einem leicht lesbaren Wort und vier Ziffern; Gross-/Kleinschreibung und äussere Leerzeichen werden ignoriert.

Nach zehn falschen Code-Eingaben ist die Einladung gesperrt, bis ein Admin sie erneut ausstellt. Es gelten zusätzlich IP-Limits für Anfragen und Registrierungen sowie die vorhandene Cloudflare-Turnstile-Konfiguration. Der Server prüft jede Freigabe unabhängig vom Formular.

Account-Erstellung und Einladungseinlösung laufen in einer Transaktion mit Zeilensperre. Gleichzeitige Anfragen können die Einladung nur einmal verwenden. Ein Fehler bei der Erstellung rollt Account und Einlösung zurück. Bestehende Logins ändern sich nicht.

Auch `/api/auth/create-apex-client` erfordert während des Einladungsbetriebs Admin-Berechtigung: Normale Apex-Nutzer dürfen keine zusätzlichen Konten ohne Freigabe anlegen. Die bestehenden Voraussetzungen für verwaltete Konten gelten weiterhin.

## Verifikation

```bash
npm run build
INVITATION_TEST_DATABASE_URL=postgresql://stararc_test:invitation-test-only@127.0.0.1:55434/stararc_invitation_test npm run test:invitations --workspace=backend
```

Die Integrationstests akzeptieren ausschliesslich eine lokale Datenbank namens `stararc_invitation_test`. Sie erstellen ein eigenes Schema und entfernen es anschliessend. E-Mail-Versand wird simuliert. Abgedeckt sind Verschlüsselung, Duplikate, Admin-Berechtigungen, Freigabe, E-Mail-Bindung, Link und Code, Ablauf, Widerruf, Sperre, Einmalnutzung bei gleichzeitigen Anfragen, Rollback und Versandfehler.
