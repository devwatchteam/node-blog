import fs from 'fs';
import chalk from 'chalk';
import { writeFile } from './utils';


//move images to docs directory
fs.readdir(`./src/static/js`, (err, files) => {

  //if error in getting
  if (err) { throw err; }

  files.map((file) => {
    const js = fs.readFileSync(`./src/static/js/${file}`);
    writeFile(`docs/static/js/${file}`, js);
    console.log(chalk.red.bold(`COPIED JS: ${file}`));
  });
});
