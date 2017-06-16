import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';

// eslint-disable-next-line
const utils = module.exports = {};

utils.writeFile = (path, contents, msg = null) => {
  mkdirp(dirname(path), (err) => {
    if (err) { throw err; }
    fs.writeFileSync(path, contents, 'utf8');
    if (msg) { console.log(msg); }
  });
};
