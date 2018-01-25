import fs from 'fs';
import ejs from 'ejs';
import chalk from 'chalk';
import { writeFile, paginate, buildNav, makeTagPostList } from './utils';
import config from '../site.config';


//create static post files
// postObjectList.map(post => {
//   const template = fs.readFileSync('src/views/static.ejs', 'utf-8');
//   const html = ejs.render(template, {
//     nav: totalNav,
//     post: post,
//     body: post.body,
//     filename: __dirname.replace('/server', '') + '/src/views/static.ejs'
//   });
//   writeFile(`docs/post/${post.filename}.html`, html);
// });



// //create tag list pages
// postTags.map(tag => {
//   const paginatedTagPostObjectList = paginate(tagPost[tag]);
//   const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
//   // create each page for paginated list
//   paginatedTagPostObjectList.map((page, i) => {
//     const taghtml = ejs.render(template, {
//       nav: totalNav,
//       tag: "/" + tag + "/",
//       page: page.page,
//       pages: page.pages,
//       list: page.list,
//       filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//     });

//     if (page.page === 0) {
//       writeFile(`docs/${tag}/index.html`, taghtml);
//     } else {
//       writeFile(`docs/${tag}/index-${i}.html`, taghtml);
//     }

//   });
// });


// //create non post pages
// pages.map(page => {

//   //remove file ext.
//   const pageLink = page.replace(/\.[^/.]+$/, "");
//   const template = fs.readFileSync(`src/views/pages/${page}`, 'utf-8');
//   const html = ejs.render(template, {
//     nav: totalNav,
//     filename: __dirname.replace('/server', '') + `/src/views/pages/${page}`
//   });
//   writeFile(`docs/${pageLink}.html`, html);
// });



// //create home page
// const indextemplate = fs.readFileSync('src/views/index.ejs', 'utf-8');

// if (postObjectList) {
//   const paginatedPostObjectList = paginate(postObjectList);

//   // create each page for paginated list
//   paginatedPostObjectList.map((page, i) => {
//     const indexhtml = ejs.render(indextemplate, {
//       nav: totalNav,
//       tag: '/',
//       page: page.page,
//       pages: page.pages,
//       list: page.list,
//       filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//     });

//     if (page.page === 0) {
//       writeFile(`docs/index.html`, indexhtml);
//     } else {
//       writeFile(`docs/index-${i}.html`, indexhtml);
//     }

//   });
// } else {
//   const indexhtml = ejs.render(indextemplate, {
//     nav: totalNav,
//     tag: '/',
//     filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//   });
//   writeFile(`docs/index.html`, indexhtml);
// }

(async () => {
  // check if post.json exist before creating links
  if (fs.existsSync('./tmp/data/post.json')) {

    // Render static pages to docs folder
    // @param {array} posts - list of post
    // @param {array} nav - array of nav objects to pass to ejs template
    // @param {string} type - what type of page to render (post, page)
    const renderPages = (posts, nav, type = 'post') => {
      let template;
      let renderedPageUrl;
      if (type === 'post') {
        //create static post files
        template = (post) => fs.readFileSync(`src/views/post.ejs`, 'utf-8');
        renderedPageUrl = (post) => `docs/post/${post.name}.html`
      } else {
        //create non post pages
        template = (post) => fs.readFileSync(`src/views/pages/${post}.ejs`, 'utf-8');
        renderedPageUrl = (post) => `docs/${post}.html`;
      }

      //create static post files
      posts.map(post => {
        console.log(`NAVIGATION YO: ${JSON.stringify(post, null, 2)}`);
        const currTemp = template(post);
        const currRenderedUrl = renderedPageUrl(post)
        const html = ejs.render(currTemp, {
          nav,
          post,
          body: post.body,
          filename: __dirname.replace('/server', '') + '/src/views/post.ejs'
        });
        writeFile(currRenderedUrl, html);
      });
    };


    // Render list pages to docs folder
    // @param {array} posts - list of post
    // @param {array} nav - array of nav objects to pass to ejs template
    // @param {string} type - what type of page to render (home, list)
    const renderListPages = (posts, nav, type = 'home') => {
      let template;
      let renderedPageUrl;
      if (type === 'home') {
        //create static post files
        template = (post) => fs.readFileSync(`src/views/post.ejs`, 'utf-8');
        renderedPageUrl = (post) => `docs/post/${post.name}.html`
      } else {
        //create non post pages
        template = (post) => fs.readFileSync(`src/views/pages/${post}.ejs`, 'utf-8');
        renderedPageUrl = (post) => `docs/${post}.html`;
      }

      //create static post files
      posts.map(post => {
        console.log(`NAVIGATION YO: ${JSON.stringify(post, null, 2)}`);
        const currTemp = template(post);
        const currRenderedUrl = renderedPageUrl(post)
        const html = ejs.render(currTemp, {
          nav,
          post,
          body: post.body,
          filename: __dirname.replace('/server', '') + '/src/views/post.ejs'
        });
        writeFile(currRenderedUrl, html);
      });
    };

    // ---------------------------------
    // -- create nav and post objects --
    // ---------------------------------
    
    // json used for tag nav and post creation
    const postData = require('../tmp/data/post.json');

    // navigation array passed to all templates
    const totalNav = await buildNav(postData, config.highlight);

    // all post objects in chronological order
    const postObjectList = [...postData.post, ...postData.highlightedPost].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return (dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
    });

    // list that holds array of post for each tag .ex css: [{}, {}],
    const tagPostObjectList = await makeTagPostList(postData.catagories, postObjectList);

    // console.log(`NAVIGATION YO: ${JSON.stringify(tagPostObjectList.tutorial, null, 2)}`);

    // ---------------------------------
    // -- Render pagess ----------------
    // ---------------------------------

    // create static post files
    // renderPages(postObjectList, totalNav);

    // render non post pages
    renderPages(postData.pages, totalNav, 'pages');

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



  

//   //add category link that will contain subnav
//   totalNav = [
//     {
//       Text: `catagories`
//     }
//   ];

//   //get list of tags and individual post objects
//   Object.keys(postData).map(poster => {
//     postTags = postTags.concat(postData[poster].tags);
//     postObjectList = postObjectList.concat(postData[poster]);
//   });

//   //alphabatize
//   postTags.sort();

//   //remove dupes
//   postTags = postTags.reduce((a, b) => {
//     if (a.indexOf(b) < 0) {
//       a.push(b);
//     }
//     return a;
//   }, []);

//   //create subnav with tags and create each tags list
//   postTags.map((item, i) => {

//     //create link object to be passed into nav array for ejs template
//     const link = {
//       Link: `${postTags[i]}`,
//       Text: `${postTags[i]}`
//     }

//     //push link object onto nav array
//     tagLinks.push(link);

//     //create tag list and push each post with the tag to its list
//     tagPost[item] = [];
//     postObjectList.map(post => {
//       if (post.tags.includes(item)) {
//         tagPost[item].push(post);
//       }
//     });
//   });

//   //sort tag list from newest to oldest
//   postObjectList.sort((a, b) => {
//     const dateA = new Date(a.date);
//     const dateB = new Date(b.date);
//     return (dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
//   });

//   //add post links to submenu
//   totalNav[totalNav.length - 1].Sub = tagLinks;

// } else {
//   postObjectList = null;
// }

// //get links for non post pages
// _await_(fs.readdir(`./src/views/pages/`, (err, pages) => {

//   //array of static page link objects
//   const pageList = [];

//   //create links for non post page's navigation
//   pages.map(page => {
//     const pageLink = page.replace(/\.[^/.]+$/, "");
//     const link = {
//       Link: `${pageLink}.html`,
//       Text: `${pageLink}`
//     }
//     pageList.push(link);
//   });

//   //add non post page list to site navigation
//   totalNav.unshift(...pageList);
// }));



// // ---------------------------------
// // -- Render pagess ----------------
// // ---------------------------------

// //render templates for pages and post
// if (fs.existsSync('./tmp/data/post.json')) {

//   //create static post files
//   postObjectList.map(post => {
//     const template = fs.readFileSync('src/views/static.ejs', 'utf-8');
//     const html = ejs.render(template, {
//       nav: totalNav,
//       post: post,
//       body: post.body,
//       filename: __dirname.replace('/server', '') + '/src/views/static.ejs'
//     });
//     writeFile(`docs/post/${post.filename}.html`, html);
//   });

//   //create tag list pages
//   postTags.map(tag => {
//     const paginatedTagPostObjectList = paginate(tagPost[tag]);
//     const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
//     // create each page for paginated list
//     paginatedTagPostObjectList.map((page, i) => {
//       const taghtml = ejs.render(template, {
//         nav: totalNav,
//         tag: "/" + tag + "/",
//         page: page.page,
//         pages: page.pages,
//         list: page.list,
//         filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//       });

//       if (page.page === 0) {
//         writeFile(`docs/${tag}/index.html`, taghtml);
//       } else {
//         writeFile(`docs/${tag}/index-${i}.html`, taghtml);
//       }

//     });

//     // const template = fs.readFileSync('src/views/index.ejs', 'utf-8');
//     // const html = ejs.render ( template , {
//     //   title: "sup dunny",
//     //   nav: totalNav,
//     //   list: tagPost[tag],
//     //   filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//     // });
//     // writeFile(`docs/${tag}/index.html`, html);
//   });
// }

// //get non post pages
// _await_(fs.readdir(`./src/views/pages/`, (err, pages) => {

//   //create non post pages
//   pages.map(page => {

//     //remove file ext.
//     const pageLink = page.replace(/\.[^/.]+$/, "");
//     const template = fs.readFileSync(`src/views/pages/${page}`, 'utf-8');
//     const html = ejs.render(template, {
//       nav: totalNav,
//       filename: __dirname.replace('/server', '') + `/src/views/pages/${page}`
//     });
//     writeFile(`docs/${pageLink}.html`, html);
//   });
// }));

// //create home page
// const indextemplate = fs.readFileSync('src/views/index.ejs', 'utf-8');

// if (postObjectList) {
//   const paginatedPostObjectList = paginate(postObjectList);

//   // create each page for paginated list
//   paginatedPostObjectList.map((page, i) => {
//     const indexhtml = ejs.render(indextemplate, {
//       nav: totalNav,
//       tag: '/',
//       page: page.page,
//       pages: page.pages,
//       list: page.list,
//       filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//     });

//     if (page.page === 0) {
//       writeFile(`docs/index.html`, indexhtml);
//     } else {
//       writeFile(`docs/index-${i}.html`, indexhtml);
//     }

//   });
// } else {
//   const indexhtml = ejs.render(indextemplate, {
//     nav: totalNav,
//     tag: '/',
//     filename: __dirname.replace('/server', '') + '/src/views/index.ejs'
//   });
//   writeFile(`docs/index.html`, indexhtml);
// }

// console.log(chalk.red.bold("SITE GENERATED"));

