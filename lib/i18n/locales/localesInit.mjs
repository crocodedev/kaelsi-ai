import fs from 'fs';
import path from 'path';

const LANG_DIR = './lib/i18n/locales'; 
const files = ['ru.json', 'en.json', 'uk.json'];

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(LANG_DIR, file), 'utf8'));
}

function collectKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null
      ? collectKeys(value, fullKey)
      : fullKey;
  });
}

const translations = Object.fromEntries(
  files.map(f => [f.replace('.json', ''), readJSON(f)])
);

const allKeys = new Set(
  Object.values(translations)
    .flatMap(obj => collectKeys(obj))
);

let hasDifferences = false;

for (const [lang, obj] of Object.entries(translations)) {
  const keys = new Set(collectKeys(obj));

  const missing = [...allKeys].filter(k => !keys.has(k));
  const extra = [...keys].filter(k => !allKeys.has(k));

  if (missing.length || extra.length) {
    console.log(`\n🌐 ${lang.toUpperCase()}:`);
    if (missing.length) {
      console.log(`  ❌ Missing (${missing.length}):`);
      missing.slice(0, 20).forEach(k => console.log(`    - ${k}`));
    }
    if (extra.length) {
      console.log(`  ⚠️ Extra (${extra.length}):`);
      extra.slice(0, 20).forEach(k => console.log(`    + ${k}`));
    }
    hasDifferences = true;
  }
}

if (!hasDifferences) {
  console.log('✅ All translation keys are synchronized across languages!');
}
