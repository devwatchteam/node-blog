#!/usr/bin/env node

const fs = require('fs');
const path = require('path');


const gitBranch = (branch) => {
  const regEx = /ref: refs\/heads\/([^\n]+)/;
  fs.readFile(`${path.join(process.cwd(), '.git/HEAD')}`, 'utf8', (err, data) => {
    //if error in getting
    if (err) throw err;
    const match = regEx.exec(data);
    if (match) {
      if (match[1] === branch) {
        console.log('Shit is legit yoooooo', match[1]);
        fs.readFile(path.join(process.cwd(),'gitignores/gitignore_publish.txt'), 'utf8', (err, data) => {
          fs.writeFile('./.gitignore', data, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
          });
          console.log('DATA', data);
        });
      } else {
        fs.readFile(path.join(process.cwd(),'gitignores/gitignore_master.txt'), 'utf8', (err, data) => {
          fs.writeFile('./.gitignore', data, (err) => {
            if (err) throw err;
            console.log('It\'s saved!');
          });
          console.log('DATA', data);
        });
      }
    }
  });
};
// gitBranch('ignore');
module.exports = gitBranch();
