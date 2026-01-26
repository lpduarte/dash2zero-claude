#!/usr/bin/env node

/**
 * Script para incrementar automaticamente a versão do Style Guide
 *
 * Uso:
 *   node scripts/bump-version.js                              # incrementa patch (1.2.0 -> 1.2.1)
 *   node scripts/bump-version.js minor                        # incrementa minor (1.2.0 -> 1.3.0)
 *   node scripts/bump-version.js major                        # incrementa major (1.2.0 -> 2.0.0)
 *   node scripts/bump-version.js patch "Mensagem changelog"   # incrementa patch e adiciona mensagem ao changelog
 *   node scripts/bump-version.js minor "Nova funcionalidade"  # incrementa minor e adiciona mensagem ao changelog
 *
 * Exemplos:
 *   npm run version:patch -- "Correção de bug no header"
 *   npm run version:minor -- "Adicionada nova seção de ícones"
 *   npm run version:major -- "Redesign completo do sistema"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STYLE_GUIDE_PATH = path.join(__dirname, '../src/pages/StyleGuide.tsx');

// Lê o ficheiro
const content = fs.readFileSync(STYLE_GUIDE_PATH, 'utf-8');

// Regex para encontrar o bloco de versão completo
const versionBlockRegex = /const STYLE_GUIDE_VERSION = \{[\s\S]*?major: (\d+),[\s\S]*?minor: (\d+),[\s\S]*?patch: (\d+),[\s\S]*?date: "([^"]+)",[\s\S]*?changelog: \[([\s\S]*?)\]\s*\};/;

const match = content.match(versionBlockRegex);

if (!match) {
  console.error('❌ Não foi possível encontrar STYLE_GUIDE_VERSION no ficheiro');
  process.exit(1);
}

let [fullMatch, major, minor, patch, date, changelogContent] = match;
major = parseInt(major);
minor = parseInt(minor);
patch = parseInt(patch);

const oldVersion = `v${major}.${minor}.${patch}`;

// Determina o tipo de bump e mensagem de changelog
const bumpType = process.argv[2] || 'patch';
const changelogMessage = process.argv[3] || null;

// Valida o tipo de bump
if (!['major', 'minor', 'patch'].includes(bumpType)) {
  // Se o primeiro argumento não é um tipo válido, assume que é uma mensagem e usa patch
  if (bumpType && !changelogMessage) {
    console.error('❌ Tipo de bump inválido. Use: major, minor, ou patch');
    console.error('   Exemplo: npm run version:patch -- "Mensagem de changelog"');
    process.exit(1);
  }
}

switch (bumpType) {
  case 'major':
    major++;
    minor = 0;
    patch = 0;
    break;
  case 'minor':
    minor++;
    patch = 0;
    break;
  case 'patch':
  default:
    patch++;
    break;
}

const newVersion = `v${major}.${minor}.${patch}`;
const newDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Processa o changelog existente
let existingChangelog = [];
if (changelogContent.trim()) {
  // Extrai as entradas existentes do changelog
  const changelogMatches = changelogContent.match(/"([^"]+)"/g);
  if (changelogMatches) {
    existingChangelog = changelogMatches.map(m => m.replace(/"/g, ''));
  }
}

// Adiciona nova mensagem ao changelog se fornecida
if (changelogMessage) {
  existingChangelog.unshift(changelogMessage); // Adiciona no início (mais recente primeiro)
}

// Limita o changelog às últimas 10 entradas para não crescer infinitamente
const MAX_CHANGELOG_ENTRIES = 10;
if (existingChangelog.length > MAX_CHANGELOG_ENTRIES) {
  existingChangelog = existingChangelog.slice(0, MAX_CHANGELOG_ENTRIES);
}

// Formata o novo changelog
const formattedChangelog = existingChangelog
  .map(entry => `    "${entry}"`)
  .join(',\n');

// Constrói o novo bloco de versão
const newVersionBlock = `const STYLE_GUIDE_VERSION = {
  major: ${major},
  minor: ${minor},
  patch: ${patch},
  date: "${newDate}",
  changelog: [
${formattedChangelog}
  ]
};`;

// Substitui o bloco de versão no conteúdo
const newContent = content.replace(versionBlockRegex, newVersionBlock);

// Escreve o ficheiro
fs.writeFileSync(STYLE_GUIDE_PATH, newContent, 'utf-8');

console.log(`✅ Versão atualizada: ${oldVersion} → ${newVersion}`);
console.log(`📅 Data: ${newDate}`);
if (changelogMessage) {
  console.log(`📝 Changelog: "${changelogMessage}"`);
}
console.log('');
console.log('Changelog atual:');
existingChangelog.forEach((entry, i) => {
  console.log(`   ${i + 1}. ${entry}`);
});
