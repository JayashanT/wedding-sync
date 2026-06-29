/**
 * Run once to hash all plaintext passwords in weddings.json with bcrypt.
 * Usage: node scripts/migrate-passwords.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const bcrypt = require('bcryptjs');

const WEDDINGS_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/data/weddings.json');
const SALT_ROUNDS = 12;

const data = JSON.parse(readFileSync(WEDDINGS_PATH, 'utf-8'));

let changed = 0;
for (const w of data.weddings) {
  // Only hash if not already a bcrypt hash (bcrypt hashes start with $2)
  if (!w.couplePassword.startsWith('$2')) {
    w.couplePassword = bcrypt.hashSync(w.couplePassword, SALT_ROUNDS);
    changed++;
    console.log(`Hashed password for: ${w.brideName} & ${w.groomName}`);
  }
}

writeFileSync(WEDDINGS_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\nDone. ${changed} password(s) hashed.`);
