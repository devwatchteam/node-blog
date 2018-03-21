import express from 'express';
import fs from 'fs';

const router = express.Router();
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');

// ---------------------
// --   post routes   --
// ---------------------

(async() => {

  // pages
  await (fs.readdir(`./src/views/pages/`, (err, pages) => {

    //create links for pages navigation
    pages.map(page => {
      const pageLink = page.replace(/\.[^/.]+$/, "");
      router.get(`${process.env.npm_package_reponame}/${pageLink}.html`, (req, res) => {
        console.log("PAGELINK: ", pageLink);
        res.sendFile(ROOT_DIR + `/${pageLink}.html`);
      });

    });
  }));

  //Home page. render list from post directory
  router.get(`${process.env.npm_package_reponame}`, (req, res) => {
    console.log("NODE-BLOG: ", req.originalUrl);
    res.sendFile(ROOT_DIR + `/index.html`);
  });

  //render single post
  router.get(`${process.env.npm_package_reponame}/post/:post`, (req, res) => {
    console.log("POST: ", req.params.post);
    res.sendFile(ROOT_DIR + `/post/${req.params.post}`);
  });

  //Home page. render list from post directory
  router.get(/(\process.env.npm_package_reponame)*\/(index)*-*[0-9]*.html/, (req, res) => {
    console.log("ORIGNAL: ", req.originalUrl.replace(`${process.env.npm_package_reponame}`, ''));
    res.sendFile(ROOT_DIR + req.originalUrl.replace(`${process.env.npm_package_reponame}`, ''));
  });

  //render list from tags
  router.get(`${process.env.npm_package_reponame}/:tag([a-zA-Z0-9]*(?!\/))`, (req, res) => {
    console.log("TAG: ", req.originalUrl, req.params.tag);
    res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
  });

})();



module.exports = router;
