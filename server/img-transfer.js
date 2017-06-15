import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import chalk from 'chalk';

//using mkdirp to make any missing directories in path for fs.writefile
//make into utils file
const writeFile = (path, contents) => {
  mkdirp(dirname(path), (err) => {
    if (err) { throw err; }
    fs.writeFileSync(path, contents, 'utf8');
  });
}

//move images to docs directory
fs.readdir(`./src/static/img`, (err, images) => {

  //if error in getting
  if (err) { throw err; }

  images.map((image) => {
    const img = fs.readFileSync(`./src/static/img/${image}`);
    writeFile(`docs/static/img/${image}`, img);
    writeFile(`tmp/node-blog/static/img/${image}`, img);
    console.log(chalk.red.bold(`${image} COPIED`));
  });
});
