import express from 'express';
import {totalNav, postList, tagPost} from '../post-compile.js';
import ejs from 'ejs';
import fm from 'front-matter';
import fs from 'fs';
import {markdown as md} from 'markdown';

const router = express.Router();
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');

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
