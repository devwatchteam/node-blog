import fs from 'fs';
import chalk from 'chalk';
import config from '../site.config';
import {
  renderListPages,
  renderPages,
  buildNav,
  makeTagPostList,
} from './utils';

(async () => {
  // check if post.json exist before creating links
  if (fs.existsSync('./tmp/data/post.json')) {

    // ---------------------------------
    // -- create nav and post objects --
    // ---------------------------------
    
    // json used for tag nav and post creation
    const postData = require('../tmp/data/post.json');

    // navigation array passed to all templates
    const totalNav = await buildNav(postData, config.highlight);

    // all post objects in chronological order
    const postObjectList = [...postData.post, ...postData.highlightedPost].sort((a, b) => {
      const dateA = new Date(a.attributes.date);
      const dateB = new Date(b.attributes.date);
      return (dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
    });

    // list that holds array of post for each tag .ex css: [{}, {}],
    const tagPostObjectList = await makeTagPostList(postData.catagories, postObjectList);

    // console.log(`NAVIGATION YO: ${JSON.stringify(tagPostObjectList.tutorial, null, 2)}`);

    // ---------------------------------
    // -- Render pagess ----------------
    // ---------------------------------

    // render home page list
    renderListPages(postObjectList, totalNav, 'home');

    // create static post files
    renderPages(postObjectList, totalNav);

    // render non post pages
    renderPages(postData.pages, totalNav, 'pages');

    // create catagory list pages
    Object.keys(tagPostObjectList).map(name => {
      // console.log(`NAVIGATION YO: ${JSON.stringify(tagPostObjectList[name], null, 2)}`);
      renderListPages(tagPostObjectList[name], totalNav, 'list', name);
    })

    console.log(chalk.red.bold("SITE GENERATED"));

  } else {
    // post.json does not exist, console error
    console.log(
      chalk.red.bold(`ERROR:`),
      chalk.blue.bold(`post.json does not exist. Run`),
      chalk.green.bold(`npm run compile:postjson`),
      chalk.blue.bold(`and then try again`),
    );
  }
})();
