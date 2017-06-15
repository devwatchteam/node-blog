import express from 'express';

const router = express.Router();
const ROOT_DIR = __dirname.replace('/server/routes', '/docs');

// ---------------------
// --   post routes   --
// ---------------------

//Home page. render list from post directory
router.get(`/`, (req, res) => {
  res.sendFile(ROOT_DIR + `/index.html`);
});

//about page
router.get(`/${process.env.npm_package_reponame}/about`, (req, res) => {
  res.sendFile(ROOT_DIR + `/about.html`);
});

//render list from tags
router.get(`/${process.env.npm_package_reponame}/:tag`, (req, res) => {
  res.sendFile(ROOT_DIR + `/${req.params.tag}/index.html`);
});

//render single post
router.get(`/${process.env.npm_package_reponame}/post/:post`, (req, res) => {
  res.sendFile(ROOT_DIR + `/post/${req.params.post}.html`);
});

module.exports = router;
