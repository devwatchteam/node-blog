import express from 'express';
import {totalNav, postList, tagPost} from '../post-compile.js';
import ejs from 'ejs';
import fm from 'front-matter';
import fs from 'fs';
import {markdown as md} from 'markdown';

const router = express.Router();

// let navLinks = [];
// let postList = []
// const sortedNav = [];
// const tagPost = {};
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');
const ABS_DIR = __dirname.replace('*', '');
//create site links for non post pages
// const totalNav =

// // ---------------------------------
// // -- create nav and post objects --
// // ---------------------------------
//
// //get list of tags and individual post objects
// Object.keys(postData).map((poster) => {
//   navLinks = navLinks.concat(postData[poster].tags);
//   postList = postList.concat(postData[poster]);
// });
//
// //alphabatize
// navLinks.sort();
// //remove dupes
// navLinks = navLinks.reduce((a, b) => {
//   if (a.indexOf(b) < 0 ) a.push(b);
//   return a;
// },[]);
// //sort from newest to oldest
// postList.sort((a, b) => {
//   const dateA = new Date(a.date);
//   const dateB = new Date(b.date);
//   return ( dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
// });
//
// //
// navLinks.map((item, i) => {
//   //create link object to be passed into nav array for ejs template
//   const link = {
//     Link:`${navLinks[i]}`,
//     Text: `${navLinks[i]}`
//   }
//   //push link object onto nav array
//   sortedNav.push(link);
//
//   tagPost[item] = [];
//   postList.map((post, index) => {
//     if(post.tags.includes(item) ) {
//       tagPost[item].push(post);
//     }
//   });
// });
//
// //add post links to site links
// totalNav[1].Sub = sortedNav;
//
//
// //create home page
// try {
//   const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
//   const html = ejs.render ( template , {
//     nav: totalNav,
//     list: postList,
//     filename: __dirname.replace('/server/routes', '') + '/src/views/index.ejs'
//   });
//   if (!fs.existsSync(`docs`)) {
//     fs.mkdirSync(`docs`);
//     fs.writeFileSync(`docs/index.html`, html, 'utf8');
//   } else {
//     fs.writeFileSync(`docs/index.html`, html, 'utf8');
//   }
// } catch (e) {
//   console.log(e);
// }
//
// //create about page
// try {
//   const template = fs.readFileSync('src/views/about.ejs', 'utf-8');
//   const html = ejs.render ( template , {
//     nav: totalNav,
//     list: postList,
//     filename: __dirname.replace('/server/routes', '') + '/src/views/about.ejs'
//   });
//   if (!fs.existsSync(`docs`)) {
//     fs.mkdirSync(`docs`);
//     fs.writeFileSync(`docs/about.html`, html, 'utf8');
//   } else {
//     fs.writeFileSync(`docs/about.html`, html, 'utf8');
//   }
// } catch (e) {
//   console.log(e);
// }
//
// //create static post files
// postList.map((post, index) => {
//   try {
//     const template = fs.readFileSync('src/views/static.ejs', 'utf-8');
//     const html = ejs.render ( template , {
//       nav: totalNav,
//       post: post,
//       body: post.body,
//       filename: __dirname.replace('/server/routes', '') + '/src/views/static.ejs'
//     });
//     if (!fs.existsSync(`docs/post/`)) {
//       fs.mkdirSync(`docs/post/`);
//       fs.writeFileSync(`docs/post/${post.filename}.html`, html, 'utf8');
//     } else {
//       fs.writeFileSync(`docs/post/${post.filename}.html`, html, 'utf8');
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });
//
// //create tag post files
// navLinks.map((tag, index) => {
//   try {
//     const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
//     const html = ejs.render ( template , {
//       title: "sup dunny",
//       nav: totalNav,
//       list: tagPost[tag],
//       filename: __dirname.replace('/server/routes', '') + '/src/views/index.ejs'
//     });
//     if (!fs.existsSync(`docs/${tag}`)) {
//       fs.mkdirSync(`docs/${tag}`);
//       fs.writeFileSync(`docs/${tag}/index.html`, html, 'utf8');
//     } else {
//       fs.writeFileSync(`docs/${tag}/index.html`, html, 'utf8');
//     }
//   } catch (e) {
//     console.log(e);
//   }
// });
//
// console.log("SITE GENERATED");
// ---------------------
// --   post routes   --
// ---------------------

//render list from post directory
router.get(`/`, (req, res) => {
  console.log(req.params);
  res.render('index', {
    nav: totalNav,
    list: postList
  });
  // res.sendFile(ROOT_DIR + `/index.html`);
});

//about page
router.get(`/${process.env.npm_package_reponame}/about`, (req, res) => {
  res.render('about', {
    nav: totalNav
  });
  // res.sendFile(ROOT_DIR + `/about.html`);
});

//render list from tags
router.get(`/${process.env.npm_package_reponame}/:tag`, (req, res) => {
  res.render('index', {
    nav: totalNav,
    list: tagPost[req.params.tag]
  });
  // res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
});

//render single post
router.get(`/${process.env.npm_package_reponame}/post/:post`, (req, res) => {
  console.log(req.params.post);
  fs.readFile(`./src/post/${req.params.post}.md`, 'utf8', (err, data) => {
    if (err) throw err;
    const content = fm(data);
    const body = md.toHTML(content.body);
    //once read render single post
    res.render('post', {
        nav: totalNav,
        post: content.attributes,
        body: body
    });
  });
});

module.exports = router;
