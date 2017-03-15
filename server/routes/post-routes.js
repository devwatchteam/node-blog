import express from 'express';
import fs from 'fs';
import fm from 'front-matter';
import {markdown as md} from 'markdown';
import ejs from 'ejs';

const postData = require('../../src/data/post.json');
const router = express.Router();

let navLinks = [];
let postList = []
const sortedNav = [];
const tagPost = {};
const ROOT_DIR = __dirname.replace('/server/routes', '/public');
const ABS_DIR = __dirname.replace('*', '');
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
console.log(totalNav);

//create home page
try {
  const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
  const html = ejs.render ( template , {
    nav: totalNav,
    list: postList,
    filename: __dirname.replace('/server/routes', '') + '/src/views/index.ejs'
  });
  fs.writeFileSync(`public/index.html`, html, 'utf8');
} catch (e) {
  console.log(e);
}

//create about page
try {
  const template = fs.readFileSync('src/views/about.ejs', 'utf-8');
  const html = ejs.render ( template , {
    nav: totalNav,
    list: postList,
    filename: __dirname.replace('/server/routes', '') + '/src/views/about.ejs'
  });
  fs.writeFileSync(`public/about.html`, html, 'utf8');
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
      filename: __dirname.replace('/server/routes', '') + '/src/views/static.ejs'
    });
    fs.writeFileSync(`public/post/${post.filename}.html`, html, 'utf8');
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
      filename: __dirname.replace('/server/routes', '') + '/src/views/index.ejs'
    });
    if (!fs.existsSync(`public/${tag}`)) {
      fs.mkdirSync(`public/${tag}`);
      fs.writeFileSync(`public/${tag}/index.html`, html, 'utf8');
    } else {
      fs.writeFileSync(`public/${tag}/index.html`, html, 'utf8');
    }
  } catch (e) {
    console.log(e);
  }
});

// ---------------------
// --   post routes   --
// ---------------------

//render list from post directory
router.get('/', (req, res) => {
  console.log(req.params);
  res.sendFile(ROOT_DIR + `/index.html`);
  // res.render('index', {
  //   nav: sortedNav,
  //   list: postList
  // });
});

//about page
router.get('/about', (req, res) => {
  res.sendFile(ROOT_DIR + `/about.html`);
  // res.render('index', {
  //   nav: sortedNav,
  //   list: postList
  // });
});

//render list from tags
router.get('/:tag', (req, res) => {
  res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
  // if (tagPost[req.params.tag]) {
  //   res.render('index', {
  //     title: "sup dunny",
  //     nav: sortedNav,
  //     list: tagPost[req.params.tag]
  //   });
  // }
});

//render single post
router.get('/post/:post', (req, res) => {
  res.sendFile(ROOT_DIR + `/post/${req.params.post}.html`);
  // const post = postData[req.params.post + '.md'];
  // res.render('post', {
  //   nav: sortedNav,
  //   post: post,
  //   body: post.body
  // });
});

module.exports = router;
