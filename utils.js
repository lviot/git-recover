const { mkdir, readFile, writeFile } = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const mkdirAwaitable = (path) => promisify(mkdir)(path, { recursive: true });

const readFileAwaitable = async (filename) => {
  try {
    const res = await promisify(readFile)(filename);

    return res.toString('ascii');
  } catch {
    return Promise.resolve('');
  }
};

const writeFileAwaitable = (filename, content) => promisify(writeFile)(filename, content);

const execAwaitable = (command) => {
  try {
    return promisify(exec)(command, { maxBuffer: 1024 * 2048 });
  } catch {
    console.warn(`stdout maxBuffer length (${2048}) exceeded. Try increasing it whit --buffer-length`);
  }
};

const getTreeFiles = async (hash) => {
  const { stderr, stdout } = await execAwaitable(`git ls-tree ${hash}`);

  if (stderr) throw new Error(stderr);
  return stdout.split('\n');
};

module.exports = {
  createDir: mkdirAwaitable,
  readFile: readFileAwaitable,
  writeFile: writeFileAwaitable,
  exec: execAwaitable,
  getTreeFiles,
};
