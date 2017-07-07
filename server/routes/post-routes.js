import express from 'express';
import fs from 'fs';
import { async as _async_ , await as _await_} from 'asyncawait';

const router = express.Router();
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');

// ---------------------
// --   post routes   --
// ---------------------

_async_ (() => {
  //Home page. render list from post directory
  router.get(`/`, (req, res) => {
    res.sendFile(ROOT_DIR + `/index.html`);
  });

  // pages
  _await_ (fs.readdir(`./src/views/pages/`, (err, pages) => {
    //create links for pages navigation
    pages.map(page => {
      const pageLink = page.replace(/\.[^/.]+$/, "");
      router.get(`/${process.env.npm_package_reponame}/${pageLink}.html`, (req, res) => {
        res.sendFile(ROOT_DIR + `/${pageLink}.html`);
      });

    });
  }));

  //render list from tags
  router.get(`/${process.env.npm_package_reponame}/:tag`, (req, res) => {
    res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
  });

  //render single post
  router.get(`/${process.env.npm_package_reponame}/post/:post`, (req, res) => {
    res.sendFile(ROOT_DIR + `/post/${req.params.post}.html`);
  });
})();



module.exports = router;
