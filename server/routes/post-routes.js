import express from 'express';
import fs from 'fs';
import { async as _async_ , await as _await_} from 'asyncawait';

const router = express.Router();
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');

// ---------------------
// --   post routes   --
// ---------------------

_async_ (() => {

  // pages
  _await_ (fs.readdir(`./src/views/pages/`, (err, pages) => {
    //create links for pages navigation
    pages.map(page => {
      const pageLink = page.replace(/\.[^/.]+$/, "");
      router.get(`${process.env.npm_package_reponame}/${pageLink}.html`, (req, res) => {
        console.log("PAGELINK: ", req.originalUrl);
        res.sendFile(ROOT_DIR + `/${pageLink}.html`);
      });

    });
  }));

  //render list from tags
  router.get(`${process.env.npm_package_reponame}/:tag`, (req, res) => {
    console.log("TAG: ", req.originalUrl);
    res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
  });

  router.get(`${process.env.npm_package_reponame}/:tag/index-[0-9]*`, (req, res) => {
    console.log("TAG-SUB: ", req.originalUrl);
    res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
  });

  //render single post
  router.get(`${process.env.npm_package_reponame}/post/:post`, (req, res) => {
    console.log("POST: ", req.originalUrl);
    res.sendFile(ROOT_DIR + `/post/${req.params.post}.html`);
  });

  //Home page. render list from post directory
  router.get(`/|/index.html`, (req, res) => {
    console.log("ORIGNAL: ", req.originalUrl);
    res.sendFile(ROOT_DIR + `/index.html`);
  });
})();



module.exports = router;
