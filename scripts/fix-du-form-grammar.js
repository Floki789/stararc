#!/usr/bin/env node
/**
 * Fix remaining grammar issues in stararc de.json after Sie→Du conversion.
 * Handles all "Verben du" patterns that the main script missed.
 */

const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'frontend', 'src', 'locales', 'de.json');
let raw = fs.readFileSync(inputFile, 'utf8');
const fixes = [];

function fix(pattern, replacement, desc) {
  const re = typeof pattern === 'string' ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g') : pattern;
  const matches = raw.match(re);
  if (matches) {
    matches.forEach(m => fixes.push({ from: m, to: m.replace(re, replacement), desc }));
    raw = raw.replace(re, replacement);
  }
}

// === All remaining "Verb+en du" → Imperative or corrected form ===

// Imperatives (Uppercase = start of sentence/clause)
fix(/\bVisualisieren du\b/g, 'Visualisiere', 'Imperativ');
fix(/\bvisualisieren du\b/g, 'visualisiere', 'Imperativ');
fix(/\bBehalten du\b/g, 'Behalte', 'Imperativ');
fix(/\bbehalten du\b/g, 'behalte', 'Imperativ');
fix(/\bÜbernehmen du\b/g, 'Übernimm', 'Imperativ');
fix(/\büberprüfen du\b/g, 'überprüfe', 'Imperativ');
fix(/\bÜberprüfen du\b/g, 'Überprüfe', 'Imperativ');
fix(/\bOrganisieren du\b/g, 'Organisiere', 'Imperativ');
fix(/\borganisieren du\b/g, 'organisiere', 'Imperativ');
fix(/\bHinterlassen du\b/g, 'Hinterlasse', 'Imperativ');
fix(/\bhinterlassen du\b/g, 'hinterlasse', 'Imperativ');
fix(/\bSchützen du\b/g, 'Schütze', 'Imperativ');
fix(/\bschützen du\b/g, 'schütze', 'Imperativ');
fix(/\bSchreiben du\b/g, 'Schreibe', 'Imperativ');
fix(/\bschreiben du\b/g, 'schreibe', 'Imperativ');
fix(/\bbewahren du\b/g, 'bewahre', 'Imperativ');
fix(/\bBewahren du\b/g, 'Bewahre', 'Imperativ');
fix(/\bVerstehen du\b/g, 'Verstehe', 'Imperativ');
fix(/\bverstehen du\b/g, 'verstehe', 'Imperativ');
fix(/\btreffen du\b/g, 'triff', 'Imperativ');
fix(/\bTreffen du\b/g, 'Triff', 'Imperativ');
fix(/\berhalten du\b/g, 'erhalte', 'Imperativ');
fix(/\bErhalten du\b/g, 'Erhalte', 'Imperativ');
fix(/\bOptimieren du\b/g, 'Optimiere', 'Imperativ');
fix(/\boptimieren du\b/g, 'optimiere', 'Imperativ');
fix(/\bSimulieren du\b/g, 'Simuliere', 'Imperativ');
fix(/\bsimulieren du\b/g, 'simuliere', 'Imperativ');
fix(/\bVertrauen du\b/g, 'Vertraue', 'Imperativ');
fix(/\bvertrauen du\b/g, 'vertraue', 'Imperativ');
fix(/\bFolgen du\b/g, 'Folge', 'Imperativ');
fix(/\bfolgen du\b/g, 'folge', 'Imperativ');

// "stimmen du" → "stimmst du" (Registrierung: agree)
fix('stimmen du unseren', 'stimmst du unseren', 'Verb-Konjugation');

// "Erfahren Sie" in line 705 (still was Sie)
fix('Erfahren Sie', 'Erfahre', 'Imperativ');
fix('Erfahren du', 'Erfahre', 'Imperativ');

// "verfolgen du" → "verfolge"
fix(/\bverfolgen du\b/g, 'verfolge', 'Imperativ');
fix(/\bVerfolgen du\b/g, 'Verfolge', 'Imperativ');

// "bauen du" → "baue"
fix(/\bbauen du\b/g, 'baue', 'Imperativ');
fix(/\bBauen du\b/g, 'Baue', 'Imperativ');

// "hält du" (from "hält Sie" leftover) → should just stay context-appropriate
// Line 1537 was already fixed manually

// Write fixed file
fs.writeFileSync(inputFile, raw, 'utf8');

// Validate
try {
  JSON.parse(raw);
  console.log('✅ Valid JSON');
} catch (e) {
  console.error('❌ INVALID JSON!', e.message);
  process.exit(1);
}

console.log(`✅ ${fixes.length} zusätzliche Grammatik-Fixes angewendet`);
fixes.forEach((f, i) => console.log(`  ${i+1}. "${f.from}" → "${f.to}"`));
