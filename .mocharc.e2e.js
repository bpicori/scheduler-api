'use strict';

module.exports = {
  jobs: 1,
  package: './package.json',
  require: ['ts-node/register', 'source-map-support/register'],
  spec: ['test/e2e/before.ts', 'test/e2e/**/*.spec.ts', 'test/e2e/after.ts'],
  recursive: true,
  timeout: 120 * 1000,
  exit: true,
  slow: 30 * 1000,
};
