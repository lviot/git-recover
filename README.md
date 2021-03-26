# git-recover
## Recover source files from git objects
NodeJS script recovering source files from a sane .git directory.

WIP, incomming features: logging system, real argument parsing, recover specific branch/commit...
## Usage
NodeJS and npm/yarn required.
```bash
git clone https://github.com/lviot/git-recover.git git-recover && cd $_
npm i
node index.js --git-dir ../my/dot/git/.dir --output recovered_repo
```
