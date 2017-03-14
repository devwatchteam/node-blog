import express from 'express';
import fs from 'fs';
import fm from 'front-matter';
import {markdown as md} from 'markdown';
import nav from '../nav.js';
const router = express.Router();

const navigation = nav((nav) => {

  // ---------------------------------
  // -- create nav and post objects --
  // ---------------------------------

  //create navigation from list of tags
  const sortedNav = [];
  const tagPost = {};
  nav.nav.map((item, i) => {
    //create link object to be passed into nav array for ejs template
    const link = {
      Link:`/${nav.nav[i]}`,
      Text: `${nav.nav[i]}`
    }
    //push link object onto nav array
    sortedNav.push(link);

    tagPost[item] = [];
    nav.list.map((post, index) => {
      if(post.tags.includes(item) ) {
        tagPost[item].push(post);
      }
    });
  });

  // ---------------------
  // --   post routes   --
  // ---------------------

  //render list from post directory
  router.get('/', (req, res) => {

    res.render('index', {
        nav: sortedNav,
        list: nav.list
    });
  });

  //render list from tags
  router.get('/:tag', (req, res) => {
    if (tagPost[req.params.tag]) {
      res.render('index', {
          title: "sup dunny",
          nav: sortedNav,
          list: tagPost[req.params.tag]
      });
    }
    res.redirect('/');

  });

  //render single post
  router.get('/post/:post', (req, res) => {
    //get yaml front matter and body of post
    fs.readFile(`./src/post/${req.params.post}`, 'utf8', (err, data) => {
      if (err) {
        res.redirect('/');
      }
      const content = fm(data);
      const body = md.toHTML(content.body);
      //once read render single post
      res.render('post', {
          nav: sortedNav,
          post: content,
          body: body
      });
    });
  });
});

module.exports = router;
