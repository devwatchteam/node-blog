import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import mkdirp from 'mkdirp';
import {dirname} from 'path';

const postData = require('../src/data/post.json');
const sortedNav = [];
const tagPost = {};
let navLinks = [];
let postList = [];
let singlePost;
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



const writeFile = (path, contents) => {
  mkdirp(dirname(path), (err) => {
    if (err) throw err;

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
  if (a.indexOf(b) < 0 ) a.push(b);
  return a;
},[]);
//sort from newest to oldest
postList.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return ( dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
});

//
navLinks.map((item, i) => {
  //create link object to be passed into nav array for ejs template
  const link = {
    Link:`${navLinks[i]}`,
    Text: `${navLinks[i]}`
  }
  //push link object onto nav array
  sortedNav.push(link);

  tagPost[item] = [];
  postList.map((post, index) => {
    if(post.tags.includes(item) ) {
      tagPost[item].push(post);
    }
  });
});

//add post links to site links
totalNav[1].Sub = sortedNav;


//create home page
try {
  const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
  const html = ejs.render ( template , {
    nav: totalNav,
    list: postList,
    filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
  });
  if (!fs.existsSync(`docs`)) {
    fs.mkdirSync(`docs`);
    fs.writeFileSync(`docs/index.html`, html, 'utf8');
  } else {
    fs.writeFileSync(`docs/index.html`, html, 'utf8');
  }
} catch (e) {
  console.log(e);
}

//create about page
try {
  const template = fs.readFileSync('src/views/about.ejs', 'utf-8');
  const html = ejs.render ( template , {
    nav: totalNav,
    list: postList,
    filename: __dirname.replace('/server', '') + '/src/views/about.ejs'
  });
  if (!fs.existsSync(`docs`)) {
    fs.mkdirSync(`docs`);
    fs.writeFileSync(`docs/about.html`, html, 'utf8');
  } else {
    fs.writeFileSync(`docs/about.html`, html, 'utf8');
  }
} catch (e) {
  console.log(e);
}

//create static post files
postList.map((post, index) => {
  try {
    const template = fs.readFileSync('src/views/static.ejs', 'utf-8');
    const html = ejs.render ( template , {
      nav: totalNav,
      post: post,
      body: post.body,
      filename: __dirname.replace('/server', '') + '/src/views/static.ejs'
    });
    if (!fs.existsSync(`docs/post/`)) {
      fs.mkdirSync(`docs/post/`);
      fs.writeFileSync(`docs/post/${post.filename}.html`, html, 'utf8');
    } else {
      fs.writeFileSync(`docs/post/${post.filename}.html`, html, 'utf8');
    }
  } catch (e) {
    console.log(e);
  }
});

//create tag post files
navLinks.map((tag, index) => {
  try {
    const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
    const html = ejs.render ( template , {
      title: "sup dunny",
      nav: totalNav,
      list: tagPost[tag],
      filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
    });
    if (!fs.existsSync(`docs/${tag}`)) {
      fs.mkdirSync(`docs/${tag}`);
      fs.writeFileSync(`docs/${tag}/index.html`, html, 'utf8');
    } else {
      fs.writeFileSync(`docs/${tag}/index.html`, html, 'utf8');
    }
  } catch (e) {
    console.log(e);
  }
});

console.log("SITE GENERATED");

sass.render({
  file: 'src/sass/main.scss',
  sourceMap: true,
  outFile: 'docs/static/css/main.css',
  outputStyle: 'compressed'
}, (err, result) => {
  postcss([autoprefixer]).process(result.css, { from: './docs/static/css/main.css', to: './docs/static/css/main.css' })
    .then(result => {
      //write to docs folder
      writeFile(`docs/static/css/main.css`, result.css);
      // if (!fs.existsSync(`docs/static/css`)) {
      //   fs.mkdirSync(`docs/static/css`);
      //   fs.writeFileSync(`docs/static/css/main.css`, result.css, 'utf8');
      // } else {
      //   fs.writeFileSync(`docs/static/css/main.css`, result.css, 'utf8');
      // }
      //write for dev
      writeFile(`src/${process.env.npm_package_reponame}/static/css/main.css`, result.css);
      // if (!fs.existsSync(`src/${process.env.npm_package_reponame}/static/css`)) {
      //   fs.mkdirSync(`src/${process.env.npm_package_reponame}/static/css`);
      //   fs.writeFileSync(`src/${process.env.npm_package_reponame}/static/css/main.css`, result.css, 'utf8');
      // } else {
      //   fs.writeFileSync(`src/${process.env.npm_package_reponame}/static/css/main.css`, result.css, 'utf8');
      // }
      console.log(`CSS COMPILED`);
    });
});

module.exports = {
  totalNav,
  postList,
  tagPost
}
