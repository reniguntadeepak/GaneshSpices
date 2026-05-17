import { config } from 'dotenv';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Must load before db.js (import this file first in index.js)
const envPath = join(dirname(fileURLToPath(import.meta.url)), '../.env');
if (existsSync(envPath)) {
  config({ path: envPath });
}
