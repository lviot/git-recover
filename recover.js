const {
  exec, createDir, writeFile, readFile, getTreeFiles,
} = require('./utils');

const processFiles = async (outputPath, file, ...files) => {
  const hash = file.match(/[a-f0-9]{40}/);
  const split = file.split(/\s/);
  const filename = split[split.length - 1];

  if (file.includes('blob')) {
    const { stdout } = await exec(`git cat-file -p ${hash}`);

    writeFile(`${outputPath}/${filename}`, stdout);
  } else if (file.includes('tree')) {
    const newTree = await getTreeFiles(hash);

    await createDir(`${outputPath}/${filename}`);

    console.log('Writing: ', `${outputPath}/${filename}`);

    processFiles(`${outputPath}/${filename}`, ...newTree);
  }
  if (files.length) processFiles(outputPath, ...files);
};

const retrieveHead = async (path) => {
  const ref = (await readFile('HEAD'))?.split(/^ref: (.*)\s$/).join('');
  const treeObjPath = (await readFile(ref))?.split(/^tree: (.*)/).join('').replace('\n', '');

  const { stderr, stdout } = await exec(`git cat-file -p ${treeObjPath}`);

  if (stderr) throw new Error(stderr);

  try {
    const hash = stdout.match(/tree (.*)/)[1];

    getTreeFiles(hash).then((files) => processFiles(path, ...files));
  } catch {
    console.warn('Unable to retreive tree');
    process.exit(1);
  }
};

module.exports = retrieveHead;
