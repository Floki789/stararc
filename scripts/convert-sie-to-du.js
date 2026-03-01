#!/usr/bin/env node
/**
 * Convert Sie-Form to Du-Form in stararc de.json
 * Same logic as spaceship conversion script, adapted for stararc paths.
 */

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'frontend', 'src', 'locales', 'de.json');
const outputFile = inputFile;
const reportFile = path.join(__dirname, '..', 'temp', 'du-form-changes.txt');

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const changes = [];

function convertSieToDu(text) {
  let result = text;

  // === POSSESSIVPRONOMEN ===
  result = result.replace(/\bIhres\b/g, 'deines');
  result = result.replace(/\bIhrem\b/g, 'deinem');
  result = result.replace(/\bIhren\b/g, 'deinen');
  result = result.replace(/\bIhrer\b/g, 'deiner');
  result = result.replace(/\bIhre\b/g, 'deine');
  result = result.replace(/\bIhr\b/g, 'dein');

  // === PERSONALPRONOMEN "Ihnen" → "dir" ===
  result = result.replace(/\bIhnen\b/g, 'dir');

  // === VERB CONJUGATIONS ===
  result = result.replace(/\bSie sind\b/g, 'du bist');
  result = result.replace(/\bSie haben\b/g, 'du hast');
  result = result.replace(/\bSie werden\b/g, 'du wirst');
  result = result.replace(/\bSie können\b/g, 'du kannst');
  result = result.replace(/\bSie möchten\b/g, 'du möchtest');
  result = result.replace(/\bSie wollen\b/g, 'du willst');
  result = result.replace(/\bSie müssen\b/g, 'du musst');
  result = result.replace(/\bSie dürfen\b/g, 'du darfst');
  result = result.replace(/\bSie sollen\b/g, 'du sollst');
  result = result.replace(/\bSie wissen\b/g, 'du weisst');

  // === IMPERATIV ===
  result = result.replace(/\bWählen Sie\b/g, 'Wähle');
  result = result.replace(/\bwählen Sie\b/g, 'wähle');
  result = result.replace(/\bGeben Sie\b/g, 'Gib');
  result = result.replace(/\bgeben Sie\b/g, 'gib');
  result = result.replace(/\bMelden Sie sich\b/g, 'Melde dich');
  result = result.replace(/\bmelden Sie sich\b/g, 'melde dich');
  result = result.replace(/\bLoggen Sie sich\b/g, 'Logge dich');
  result = result.replace(/\bloggen Sie sich\b/g, 'logge dich');
  result = result.replace(/\bVersuchen Sie\b/g, 'Versuche');
  result = result.replace(/\bversuchen Sie\b/g, 'versuche');
  result = result.replace(/\bPrüfen Sie\b/g, 'Prüfe');
  result = result.replace(/\bprüfen Sie\b/g, 'prüfe');
  result = result.replace(/\bÜberprüfen Sie\b/g, 'Überprüfe');
  result = result.replace(/\büberprüfen Sie\b/g, 'überprüfe');
  result = result.replace(/\bStellen Sie sicher\b/g, 'Stelle sicher');
  result = result.replace(/\bstellen Sie sicher\b/g, 'stelle sicher');
  result = result.replace(/\bFügen Sie\b/g, 'Füge');
  result = result.replace(/\bfügen Sie\b/g, 'füge');
  result = result.replace(/\bErstellen Sie\b/g, 'Erstelle');
  result = result.replace(/\berstellen Sie\b/g, 'erstelle');
  result = result.replace(/\bBestätigen Sie\b/g, 'Bestätige');
  result = result.replace(/\bbestätigen Sie\b/g, 'bestätige');
  result = result.replace(/\bGehen Sie\b/g, 'Gehe');
  result = result.replace(/\bgehen Sie\b/g, 'gehe');
  result = result.replace(/\bKlicken Sie\b/g, 'Klicke');
  result = result.replace(/\bklicken Sie\b/g, 'klicke');
  result = result.replace(/\bVerwenden Sie\b/g, 'Verwende');
  result = result.replace(/\bverwenden Sie\b/g, 'verwende');
  result = result.replace(/\bNutzen Sie\b/g, 'Nutze');
  result = result.replace(/\bnutzen Sie\b/g, 'nutze');
  result = result.replace(/\bBeachten Sie\b/g, 'Beachte');
  result = result.replace(/\bbeachten Sie\b/g, 'beachte');
  result = result.replace(/\bBeginnen Sie\b/g, 'Beginne');
  result = result.replace(/\bbeginnen Sie\b/g, 'beginne');
  result = result.replace(/\bDefinieren Sie\b/g, 'Definiere');
  result = result.replace(/\bdefinieren Sie\b/g, 'definiere');
  result = result.replace(/\bLegen Sie\b/g, 'Lege');
  result = result.replace(/\blegen Sie\b/g, 'lege');
  result = result.replace(/\bPassen Sie\b/g, 'Passe');
  result = result.replace(/\bpassen Sie\b/g, 'passe');
  result = result.replace(/\bTragen Sie\b/g, 'Trage');
  result = result.replace(/\btragen Sie\b/g, 'trage');
  result = result.replace(/\bOrdnen Sie\b/g, 'Ordne');
  result = result.replace(/\bordnen Sie\b/g, 'ordne');
  result = result.replace(/\bKlassifizieren Sie\b/g, 'Klassifiziere');
  result = result.replace(/\bklassifizieren Sie\b/g, 'klassifiziere');
  result = result.replace(/\bFüllen Sie\b/g, 'Fülle');
  result = result.replace(/\bfüllen Sie\b/g, 'fülle');
  result = result.replace(/\bVerwalten Sie\b/g, 'Verwalte');
  result = result.replace(/\bverwalten Sie\b/g, 'verwalte');
  result = result.replace(/\bErfassen Sie\b/g, 'Erfasse');
  result = result.replace(/\berfassen Sie\b/g, 'erfasse');
  result = result.replace(/\bInformieren Sie sich\b/g, 'Informiere dich');
  result = result.replace(/\binformieren Sie sich\b/g, 'informiere dich');
  result = result.replace(/\bBearbeiten Sie\b/g, 'Bearbeite');
  result = result.replace(/\bbearbeiten Sie\b/g, 'bearbeite');
  result = result.replace(/\bSpeichern Sie\b/g, 'Speichere');
  result = result.replace(/\bspeichern Sie\b/g, 'speichere');
  result = result.replace(/\bWiederholen Sie\b/g, 'Wiederhole');
  result = result.replace(/\bwiederholen Sie\b/g, 'wiederhole');
  result = result.replace(/\bSchliessen Sie\b/g, 'Schliesse');
  result = result.replace(/\bschliessen Sie\b/g, 'schliesse');
  result = result.replace(/\bLaden Sie\b/g, 'Lade');
  result = result.replace(/\bladen Sie\b/g, 'lade');
  result = result.replace(/\bAchten Sie\b/g, 'Achte');
  result = result.replace(/\bachten Sie\b/g, 'achte');
  result = result.replace(/\bAktivieren Sie\b/g, 'Aktiviere');
  result = result.replace(/\baktivieren Sie\b/g, 'aktiviere');
  result = result.replace(/\bScannen Sie\b/g, 'Scanne');
  result = result.replace(/\bscannen Sie\b/g, 'scanne');
  result = result.replace(/\bHalten Sie\b/g, 'Halte');
  result = result.replace(/\bhalten Sie\b/g, 'halte');
  result = result.replace(/\bMarkieren Sie\b/g, 'Markiere');
  result = result.replace(/\bmarkieren Sie\b/g, 'markiere');
  result = result.replace(/\bSetzen Sie\b/g, 'Setze');
  result = result.replace(/\bsetzen Sie\b/g, 'setze');
  result = result.replace(/\bZiehen Sie\b/g, 'Ziehe');
  result = result.replace(/\bziehen Sie\b/g, 'ziehe');
  result = result.replace(/\bPlanen Sie\b/g, 'Plane');
  result = result.replace(/\bplanen Sie\b/g, 'plane');
  result = result.replace(/\bSehen Sie\b/g, 'Sieh');
  result = result.replace(/\bsehen Sie\b/g, 'sieh');
  result = result.replace(/\bNehmen Sie\b/g, 'Nimm');
  result = result.replace(/\bnehmen Sie\b/g, 'nimm');
  result = result.replace(/\bLesen Sie\b/g, 'Lies');
  result = result.replace(/\blesen Sie\b/g, 'lies');
  result = result.replace(/\bKontaktieren Sie\b/g, 'Kontaktiere');
  result = result.replace(/\bkontaktieren Sie\b/g, 'kontaktiere');
  result = result.replace(/\bEntscheiden Sie\b/g, 'Entscheide');
  result = result.replace(/\bentscheiden Sie\b/g, 'entscheide');
  result = result.replace(/\bBezahlen Sie\b/g, 'Bezahle');
  result = result.replace(/\bbezahlen Sie\b/g, 'bezahle');
  result = result.replace(/\bSchließen Sie\b/g, 'Schließe');
  result = result.replace(/\bschließen Sie\b/g, 'schließe');
  result = result.replace(/\bAktualisieren Sie\b/g, 'Aktualisiere');
  result = result.replace(/\baktualisieren Sie\b/g, 'aktualisiere');
  result = result.replace(/\bBestimmen Sie\b/g, 'Bestimme');
  result = result.replace(/\bbestimmen Sie\b/g, 'bestimme');
  result = result.replace(/\bEntfernen Sie\b/g, 'Entferne');
  result = result.replace(/\bentfernen Sie\b/g, 'entferne');
  result = result.replace(/\bKonfigurieren Sie\b/g, 'Konfiguriere');
  result = result.replace(/\bkonfigurieren Sie\b/g, 'konfiguriere');
  result = result.replace(/\bÄndern Sie\b/g, 'Ändere');
  result = result.replace(/\bändern Sie\b/g, 'ändere');
  result = result.replace(/\bVerbinden Sie\b/g, 'Verbinde');
  result = result.replace(/\bverbinden Sie\b/g, 'verbinde');
  result = result.replace(/\bAbonnieren Sie\b/g, 'Abonniere');
  result = result.replace(/\babonnieren Sie\b/g, 'abonniere');
  result = result.replace(/\bVergleichen Sie\b/g, 'Vergleiche');
  result = result.replace(/\bvergleichen Sie\b/g, 'vergleiche');

  // === REFLEXIV ===
  result = result.replace(/\bSie sich\b/g, 'dich');
  result = result.replace(/\bsie sich\b/g, 'dich');

  // === FRAGEN ===
  result = result.replace(/\bSind Sie\b/g, 'Bist du');
  result = result.replace(/\bsind Sie\b/g, 'bist du');
  result = result.replace(/\bHaben Sie\b/g, 'Hast du');
  result = result.replace(/\bhaben Sie\b/g, 'hast du');
  result = result.replace(/\bWerden Sie\b/g, 'Wirst du');
  result = result.replace(/\bwerden Sie\b/g, 'wirst du');
  result = result.replace(/\bKönnen Sie\b/g, 'Kannst du');
  result = result.replace(/\bkönnen Sie\b/g, 'kannst du');
  result = result.replace(/\bMöchten Sie\b/g, 'Möchtest du');
  result = result.replace(/\bmöchten Sie\b/g, 'möchtest du');

  // === GENERIC: remaining "Sie " → "du " ===
  result = result.replace(/\bSie ([a-zäöü])/g, 'du $1');

  return result;
}

function walkAndConvert(obj, keyPath = '') {
  if (typeof obj === 'string') {
    const converted = convertSieToDu(obj);
    if (converted !== obj) {
      changes.push({ key: keyPath, newValue: converted });
    }
    return converted;
  }
  if (Array.isArray(obj)) {
    return obj.map((item, i) => walkAndConvert(item, `${keyPath}[${i}]`));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = walkAndConvert(value, keyPath ? `${keyPath}.${key}` : key);
    }
    return result;
  }
  return obj;
}

const converted = walkAndConvert(data);
fs.writeFileSync(outputFile, JSON.stringify(converted, null, 2) + '\n', 'utf8');

// === GRAMMAR FIXES (apply directly on the raw string) ===
let raw = fs.readFileSync(outputFile, 'utf8');
const fixes = [];

function fix(pattern, replacement, desc) {
  const re = typeof pattern === 'string' ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : pattern;
  const matches = raw.match(re);
  if (matches) {
    matches.forEach(m => fixes.push({ from: m, to: m.replace(re, replacement), desc }));
    raw = raw.replace(re, replacement);
  }
}

// Missed imperatives: "Verbxxx du" → correct form
fix(/\bDokumentieren du\b/g, 'Dokumentiere', 'Imperativ');
fix(/\bAktualisieren du\b/g, 'Aktualisiere', 'Imperativ');
fix(/\bBerücksichtigen du\b/g, 'Berücksichtige', 'Imperativ');
fix(/\bDiversifizieren du\b/g, 'Diversifiziere', 'Imperativ');
fix(/\bInvestieren du\b/g, 'Investiere', 'Imperativ');
fix(/\bKontaktieren du\b/g, 'Kontaktiere', 'Imperativ');
fix(/\bKonsultieren du\b/g, 'Konsultiere', 'Imperativ');
fix(/\bTeilen du\b/g, 'Teile', 'Imperativ');
fix(/\bMischen du\b/g, 'Mische', 'Imperativ');
fix(/\bSammeln du\b/g, 'Sammle', 'Imperativ');
fix(/\bBestimmen du\b/g, 'Bestimme', 'Imperativ');
fix(/\bEntfernen du\b/g, 'Entferne', 'Imperativ');
fix(/\bÜberprüfen du\b/g, 'Überprüfe', 'Imperativ');
fix(/\bKorrigieren du\b/g, 'Korrigiere', 'Imperativ');
fix(/\bSichern du\b/g, 'Sichere', 'Imperativ');
fix(/\bErwägen du\b/g, 'Erwäge', 'Imperativ');
fix(/\bTesten du\b/g, 'Teste', 'Imperativ');
fix(/\bSchneiden du\b/g, 'Schneide', 'Imperativ');
fix(/\bVervollständigen du\b/g, 'Vervollständige', 'Imperativ');
fix(/\bStarten du\b/g, 'Starte', 'Imperativ');
fix(/\bEntdecken du\b/g, 'Entdecke', 'Imperativ');
fix(/\bBeheben du\b/g, 'Behebe', 'Imperativ');
fix(/\bErhalten du\b/g, 'Erhalte', 'Imperativ');
fix(/\bSeien du\b/g, 'Sei', 'Imperativ');
fix(/\bLernen du\b/g, 'Lerne', 'Imperativ');
fix(/\bWechseln du\b/g, 'Wechsle', 'Imperativ');
fix(/\bVerknüpfen du\b/g, 'Verknüpfe', 'Imperativ');
fix(/\bBedenken du\b/g, 'Bedenke', 'Imperativ');
fix(/\bBudgetieren du\b/g, 'Budgetiere', 'Imperativ');
fix(/\bVermeiden du\b/g, 'Vermeide', 'Imperativ');
fix(/\bBewahren du\b/g, 'Bewahre', 'Imperativ');
fix(/\bInformieren du\b/g, 'Informiere', 'Imperativ');
fix(/\bErkunden du\b/g, 'Erkunde', 'Imperativ');
fix(/\bAbonnieren du\b/g, 'Abonniere', 'Imperativ');
fix(/\bVergleichen du\b/g, 'Vergleiche', 'Imperativ');
fix(/\bKonfigurieren du\b/g, 'Konfiguriere', 'Imperativ');
fix(/\bVerbinden du\b/g, 'Verbinde', 'Imperativ');
fix(/\bÄndern du\b/g, 'Ändere', 'Imperativ');
fix(/\bBezahlen du\b/g, 'Bezahle', 'Imperativ');
fix(/\bEntscheiden du\b/g, 'Entscheide', 'Imperativ');

// lowercase variants
fix(/\bdokumentieren du\b/g, 'dokumentiere', 'Imperativ');
fix(/\baktualisieren du\b/g, 'aktualisiere', 'Imperativ');
fix(/\bberücksichtigen du\b/g, 'berücksichtige', 'Imperativ');
fix(/\bentfernen du\b/g, 'entferne', 'Imperativ');
fix(/\büberprüfen du\b/g, 'überprüfe', 'Imperativ');
fix(/\bverschieben du\b/g, 'verschiebe', 'Imperativ');
fix(/\bbehalten du\b/g, 'behalte', 'Imperativ');

// Modal verbs in subclauses
fix(/\bMöchten du\b/g, 'Möchtest du', 'Modal');
fix(/\bmöchten du\b/g, 'möchtest du', 'Modal');
fix(/\bdu (.*?) möchten\b/g, 'du $1 möchtest', 'Modal Nebensatz');
fix(/\bdu (.*?) können\b/g, 'du $1 kannst', 'Modal können→kannst');
fix(/\bund können nun\b/g, 'und kannst nun', 'Modal');

// Reflexive
fix(/\bdu kannst sich\b/g, 'du kannst dich', 'Reflexiv');
fix(/\bdu wirst sich\b/g, 'du wirst dich', 'Reflexiv');

// Sentence-start capitalization
fix(/\. du /g, '. Du ', 'Satzanfang');
fix(/! du /g, '! Du ', 'Satzanfang');
fix(/": "du /g, '": "Du ', 'Wertanfang');
fix(/\. dein /g, '. Dein ', 'Satzanfang');
fix(/": "dein /g, '": "Dein ', 'Wertanfang');
fix(/\. deine /g, '. Deine ', 'Satzanfang');
fix(/": "deine /g, '": "Deine ', 'Wertanfang');

// "haben" after "du ... registriert" etc
fix(/\bdu (.*?) registriert haben\b/g, 'du $1 registriert hast', 'haben→hast');
fix(/\bdu (.*?) verwendet haben\b/g, 'du $1 verwendet hast', 'haben→hast');

// "So upgraden du" → "So upgradest du"
fix(/\bSo upgraden du\b/g, 'So upgradest du', 'Verb');

fs.writeFileSync(outputFile, raw, 'utf8');

// Validate JSON
try {
  JSON.parse(raw);
} catch (e) {
  console.error('❌ INVALID JSON after fixes!', e.message);
  process.exit(1);
}

// Generate final report
const oldRaw = require('child_process').execSync(
  'git show HEAD:frontend/src/locales/de.json',
  { encoding: 'utf8', cwd: path.join(__dirname, '..') }
);
const oldData = JSON.parse(oldRaw);
const newData = JSON.parse(raw);
const finalChanges = [];

function compare(oldObj, newObj, keyPath = '') {
  if (typeof newObj === 'string' && typeof oldObj === 'string') {
    if (newObj !== oldObj) finalChanges.push({ key: keyPath, value: newObj });
    return;
  }
  if (Array.isArray(newObj) && Array.isArray(oldObj)) {
    for (let i = 0; i < Math.max(newObj.length, oldObj.length); i++) {
      if (i < newObj.length && i < oldObj.length) compare(oldObj[i], newObj[i], `${keyPath}[${i}]`);
    }
    return;
  }
  if (typeof newObj === 'object' && newObj !== null && typeof oldObj === 'object' && oldObj !== null) {
    for (const key of Object.keys(newObj)) {
      if (key in oldObj) compare(oldObj[key], newObj[key], keyPath ? `${keyPath}.${key}` : key);
    }
  }
}
compare(oldData, newData);

fs.mkdirSync(path.dirname(reportFile), { recursive: true });
let report = `=== STARARC DU-FORM REVIEW: ${finalChanges.length} geänderte Strings ===\n`;
report += `=== Bitte auf Grammatik prüfen ===\n\n`;
finalChanges.forEach((c, i) => {
  report += `${i + 1}. [${c.key}]\n   ${c.value}\n\n`;
});
fs.writeFileSync(reportFile, report, 'utf8');

console.log(`✅ ${changes.length} Strings konvertiert, ${fixes.length} Grammatik-Fixes`);
console.log(`📄 ${finalChanges.length} Änderungen gesamt → ${reportFile}`);
