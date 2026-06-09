const { defineConfig } = require('@playwright/test');

// Only the Electron end-to-end spec runs under Playwright; the Jest unit
// specs are handled separately by `npm test`.
module.exports = defineConfig({
    testDir: './test',
    testMatch: 'system.spec.js',
    timeout: 30000,
    workers: 1, // single Electron instance, no parallelism
});
