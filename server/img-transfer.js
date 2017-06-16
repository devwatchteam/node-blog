import fs from 'fs';
import chalk from 'chalk';
import { writeFile } from './utils';


//move images to docs directory
fs.readdir(`./src/static/img`, (err, images) => {

  //if error in getting
  if (err) { throw err; }

  images.map((image) => {
    const img = fs.readFileSync(`./src/static/img/${image}`);
    writeFile(`docs/static/img/${image}`, img);
    writeFile(`tmp/node-blog/static/img/${image}`, img);
    console.log(chalk.red.bold(`COPIED IMG: ${image}`));
  });
});
