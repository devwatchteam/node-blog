// import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import chalk from 'chalk';

const postData = require('../tmp/data/post.json');
// const ROOT_DIR = __dirname.replace('/server', '');
const sortedNav = [];
const tagPost = {};
let navLinks = [];
let postList = [];
// let singlePost;
//create site links for non post pages
const totalNav = [
  {
    Link:`about`,
    Text: `about`
  },
  {
    Text: `catagories`
  },
];

//using mkdirp to make any missing directories in path for fs.writefile
const writeFile = (path, contents) => {
  mkdirp(dirname(path), (err) => {
    if (err) { throw err; }
    fs.writeFileSync(path, contents, 'utf8');
  });
}

// ---------------------------------
// -- create nav and post objects --
// ---------------------------------

//get list of tags and individual post objects
Object.keys(postData).map((poster) => {
  navLinks = navLinks.concat(postData[poster].tags);
  postList = postList.concat(postData[poster]);
});

//alphabatize
navLinks.sort();

//remove dupes
navLinks = navLinks.reduce((a, b) => {
  if (a.indexOf(b) < 0 ) {
    a.push(b);
  }
  return a;
},[]);


navLinks.map((item, i) => {

  //create link object to be passed into nav array for ejs template
  const link = {
    Link:`${navLinks[i]}`,
    Text: `${navLinks[i]}`
  }
  //push link object onto nav array
  sortedNav.push(link);

  //create tag list and push each post with the tag to its list
  tagPost[item] = [];
  postList.map((post) => {
    if(post.tags.includes(item) ) {
      tagPost[item].push(post);
    }
  });
});

//sort from newest to oldest
postList.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return ( dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
});

//add post links to site links
totalNav[1].Sub = sortedNav;

// ---------------------------------
// -- Render pagess ----------------
// ---------------------------------

//create home page
const indextemplate = fs.readFileSync('src/views/index.ejs', 'utf-8');
const indexhtml = ejs.render ( indextemplate , {
  nav: totalNav,
  list: postList,
  filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
});
writeFile(`docs/index.html`, indexhtml);

//create about page
const abouttemplate = fs.readFileSync('src/views/about.ejs', 'utf-8');
const abouthtml = ejs.render ( abouttemplate , {
  nav: totalNav,
  list: postList,
  filename: __dirname.replace('/server', '') + '/src/views/about.ejs'
});
writeFile(`docs/about.html`, abouthtml);

//create static post files
postList.map((post) => {
  const template = fs.readFileSync('src/views/static.ejs', 'utf-8');
  const html = ejs.render ( template , {
    nav: totalNav,
    post: post,
    body: post.body,
    filename: __dirname.replace('/server', '') + '/src/views/static.ejs'
  });
  writeFile(`docs/post/${post.filename}.html`, html);
});

//create tag post files
navLinks.map((tag) => {
  const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
  const html = ejs.render ( template , {
    title: "sup dunny",
    nav: totalNav,
    list: tagPost[tag],
    filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
  });
  writeFile(`docs/${tag}/index.html`, html);
});

console.log(chalk.red.bold("SITE GENERATED"));

module.exports = {
  totalNav,
  postList,
  tagPost
}
