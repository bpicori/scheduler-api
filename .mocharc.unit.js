'use strict';
module.exports = {
  jobs: 1,
  package: './package.json',
  require: ['ts-node/register', 'source-map-support/register'],
  spec: ['test/unit/**/*.spec.ts'],
  watch: false,
  watchFiles: 'test/**/*.ts',
  recursive: true,
};
