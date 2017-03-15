import express from 'express';
import fs from 'fs';
import fm from 'front-matter';
import {markdown as md} from 'markdown';
const postData = require('../../src/data/post.json');
const router = express.Router();


  // ---------------------------------
  // -- create nav and post objects --
  // ---------------------------------

  //create navigation from list of tags
  let navLinks = [];
  let postList = []
  const sortedNav = [];
  const tagPost = {};
  Object.keys(postData).map((poster) => {
    navLinks = navLinks.concat(postData[poster].tags);
    postList = postList.concat(postData[poster]);
  });
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
  console.log("POST DATA:", navLinks);
  navLinks.map((item, i) => {
    //create link object to be passed into nav array for ejs template
    const link = {
      Link:`/${navLinks[i]}`,
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

  // ---------------------
  // --   post routes   --
  // ---------------------

  //render list from post directory
  router.get('/', (req, res) => {

    res.render('index', {
        nav: sortedNav,
        list: postList
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
  });

  //render single post
  router.get('/post/:post', (req, res) => {
    const post = postData[req.params.post + '.md'];
    res.render('post', {
      nav: sortedNav,
      post: post,
      body: post.body
    });
  });

module.exports = router;
