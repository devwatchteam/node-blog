import fs from 'fs';
import fm from 'front-matter';
import { markdown as md } from 'markdown';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import { dirname } from 'path';

(() => {

  //get directory post
  fs.readdir(`./src/post/`, (err, posts) => {

    //if error in getting
    if (err) { throw err; }

    //create array to store list of post
    let postList = {};

    //create an array to store the tags which will make up our nav
    let nav = [];

    //map through each post and pull out the data
    posts.map((post) => {
      const fileName = post;

      //get yaml front matter from each post file
      fs.readFile(`./src/post/${fileName}`, 'utf8', (err, data) => {

        //if error in getting
        if (err) { throw err; }

        //pull yaml front matter
        const content = fm(data);
        const postData = content.attributes;

        //parse markdown and store the html
        postData.body = md.toHTML(content.body);

        //get file name and remove extension
        postData.filename = fileName.replace(/\.[^/.]+$/, "");

        //push new post object onto list array
        postList[fileName] = postData;

        //add post tags array to nav array to get filtered (no dupes)
        nav = nav.concat(postData.tags).reduce((a, b) => {
          if (a.indexOf(b) < 0 ) { a.push(b); }
          return a;
        },[]);

        //using mkdirp to make any missing directories in path for fs.writefile
        const writeFile = (path, contents) => {
          mkdirp(dirname(path), (err) => {
            if (err) { throw err; }
            fs.writeFileSync(path, contents, 'utf8');
            console.log(chalk.red.bold(`${postData.filename} SAVED TO POST.JSON`));
          });
        };
        
        //create json file to with post data.
        writeFile('tmp/data/post.json', JSON.stringify(postList, null, 2));
      });
    });
  });
})();
