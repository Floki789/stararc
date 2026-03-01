#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filePath = 'frontend/src/locales/de.json';
const cwd = path.join(__dirname, '..');
const reportFile = path.join(cwd, 'temp', 'du-form-final-review.txt');

const oldRaw = execSync(`git show HEAD:${filePath}`, { encoding: 'utf8', cwd });
const newRaw = fs.readFileSync(path.join(cwd, filePath), 'utf8');
const oldData = JSON.parse(oldRaw);
const newData = JSON.parse(newRaw);
const changes = [];

function compare(oldObj, newObj, keyPath = '') {
  if (typeof newObj === 'string' && typeof oldObj === 'string') {
    if (newObj !== oldObj) changes.push({ key: keyPath, value: newObj });
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
let report = `=== STARARC DU-FORM REVIEW: ${changes.length} geänderte Strings ===\n`;
report += `=== Bitte auf Grammatik prüfen ===\n\n`;
changes.forEach((c, i) => {
  report += `${i + 1}. [${c.key}]\n   ${c.value}\n\n`;
});
fs.writeFileSync(reportFile, report, 'utf8');
console.log(`📄 ${changes.length} Änderungen → ${reportFile}`);
