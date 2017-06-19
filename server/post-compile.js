// import express from 'express';
import fs from 'fs';
import ejs from 'ejs';
import { writeFile } from './utils';
import chalk from 'chalk';
import { async as _async_ , await as _await_} from 'asyncawait';


_async_ (() => {
  const postData = require('../tmp/data/post.json');
  const sortedNav = [];
  const tagPost = {};
  let navLinks = [];
  let postList = [];
  let pageList = [];

  //create site links that will be populated by post and pages
  const totalNav = [
    {
      Text: `catagories`
    }
  ];


  // ---------------------------------
  // -- create nav and post objects --
  // ---------------------------------

  //get list of tags and individual post objects
  Object.keys(postData).map(poster => {
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

  //create subnav with tags and create each tags list
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
    postList.map(post => {
      if(post.tags.includes(item) ) {
        tagPost[item].push(post);
      }
    });
  });

  //sort tag list from newest to oldest
  postList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ( dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
  });

  //add post links to submenu
  totalNav[totalNav.length - 1].Sub = sortedNav;


  // ---------------------------------
  // -- Render pagess ----------------
  // ---------------------------------

  //get non post pages
  _await_ (fs.readdir(`./src/views/pages/`, (err, pages) => {

    //create links for non post page's navigation
    pages.map(page => {
      const pageLink = page.replace(/\.[^/.]+$/, "");
      const link = {
        Link:`${pageLink}`,
        Text: `${pageLink}`
      }
      pageList.push(link);
    });

    //add non post page list to site navigation
    totalNav.unshift(...pageList);

    //create non post pages
    pages.map(page => {

      //remove file ext.
      const pageLink = page.replace(/\.[^/.]+$/, "");
      const template = fs.readFileSync(`src/views/pages/${page}`, 'utf-8');
      const html = ejs.render ( template , {
        nav: totalNav,
        list: postList,
        filename: __dirname.replace('/server', '') + `/src/views/pages/${page}`
      });
      writeFile(`docs/${pageLink}.html`, html);
    });
  }));

  //create home page
  const indextemplate = fs.readFileSync('src/views/index.ejs', 'utf-8');
  const indexhtml = ejs.render ( indextemplate , {
    nav: totalNav,
    list: postList,
    filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
  });
  writeFile(`docs/index.html`, indexhtml);

  //create static post files
  postList.map(post => {
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
  navLinks.map(tag => {
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
})();
