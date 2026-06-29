/**
 * Post-build step: rename .open-next/worker.js → .open-next/_worker.js
 * Cloudflare Pages Advanced Mode requires _worker.js (with underscore)
 * to recognise the file as a Worker entry point.
 */
import { renameSync, existsSync } from 'fs';
import { join } from 'path';

const src = join('.open-next', 'worker.js');
const dst = join('.open-next', '_worker.js');

if (existsSync(src)) {
  renameSync(src, dst);
  console.log('✓ Renamed worker.js → _worker.js for Cloudflare Pages');
} else if (existsSync(dst)) {
  console.log('✓ _worker.js already exists, nothing to rename');
} else {
  console.error('✗ Neither worker.js nor _worker.js found in .open-next/');
  process.exit(1);
}
