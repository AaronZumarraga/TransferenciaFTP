import cron from 'node-cron';

import { createPoliza } from './app.js';

async function main() {
  cron.schedule('*/10 * * * * *', () => {
    createPoliza();
  });
}

main();