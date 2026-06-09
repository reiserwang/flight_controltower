module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/?(*.)+(spec).js'],
    // system.spec.js launches the real Electron app via Playwright and uses
    // Playwright's matchers, so it can't run under the Jest runner. Run it
    // separately (see "test:system" in package.json).
    testPathIgnorePatterns: ['/node_modules/', '/test/system\\.spec\\.js$'],
};
