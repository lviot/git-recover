#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { normalize } = require('path');
const recover = require('./recover');
const { createDir } = require('./utils');

const { argv: { 'git-dir': directory, output } } = yargs(hideBin(process.argv));

const path = normalize(`${__dirname}/${output ?? 'output'}`);

if (!directory) {
  console.warn('Usage: node index.js --git-dir=<git-directory> [--output=<output-directory>]');
  process.exit(1);
}

(async () => {
  try {
    await createDir(path);

    process.chdir(directory);
    recover(path);
  } catch (e) {
    console.warn(e.message);
    process.exit(1);
  }
})();
