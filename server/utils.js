import fs from 'fs';
import fm from 'front-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import mkdirp from 'mkdirp';
import path, { dirname } from 'path';
import config from '../site.config';

// parse markdown to add highlight classes and reformat for line numbers
const md = new markdown({
  highlight: function (str) {
    //create line numbers for code block
    let lineNumber = 0;

    //pass in names of languages to autodetect and highlight
    const hl = hljs.highlightAuto(str, ['html', 'javascript', 'css', 'sass', 'shell']).value;

    //create regex literal to search for
    const commentPattern = /<span class="hljs-comment">(.|\n)*?<\/span>/g;

    //This puts comments on a newline so that a line number will be added to comments as well
    const adaptedHighlightedContent = hl.replace(commentPattern, data => {
      return data.replace(/\r?\n/g, () => {
        return '\n<span class="hljs-comment">';
      });
    });

    // wraps the line number and content line in markup that will provide our highlight styles
    const contentBlock = adaptedHighlightedContent.split(/\r?\n/).map(lineContent => {
      return `<div class="code-line">
                <span class="code-line-number" data-pseudo-content=${++lineNumber}></span>
                <span class="code-line-content">${lineContent}</span>
              </div>`
    }).join('');

    return `<pre class="code">
              <code class="code-block">${contentBlock}</code>
            </pre>`;
  }
});

// ------------------------------------------
// -- File Actions --------------------------
// ------------------------------------------

// Retrieve file name, attributes and body of specified file
// @param {string} url - the url path of file to be parsed
// @return {object} - Post object that contains name of file, attributes, body, highlighted post boolean
export const parseFile = (url) => {
  const data = fs.readFileSync(url, 'utf8');
  // pull yaml front matter
  const content = fm(data);

  //get catagories
  const cat = content.attributes.catagory;

  //create post object
  const fileContent = {
    // use url to get filename and remove the extension
    // {string}
    name: url.substr(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, ""),
    // grab YAML front matter
    // {object} -> title:<string>, desc:<string>, author:<string>, tags:<array>, date:<string>, highlight:<boolean>
    attributes: content.attributes,
    // parse markdown and store the html
    body: md.render(content.body),
    // check if post contained a tutorial tag
    // {boolean}
    highlight: cat ? cat.includes(config.highlight) : false,
  }
  return fileContent;
};

// write files to a directory/ will create directories that are not present
// @param {string} path - the url path to write the file to
// @param {object} contents - contents being written to file
// @param {string} msg - message to be consoled out when file is written
// @return {boolean} true - returns true if no errors
export const writeFile = (path, contents, msg = null) => {
  // make directory path if does not exist
  mkdirp(dirname(path), (err) => {
    if (err) { throw err; }

    // write file contents to given path
    fs.writeFileSync(path, contents, 'utf8');

    // log provided or default message
    console.log(msg || `File written!`);
  });
};

// Recursively get an array of file names in a given directory
// @param {string} dir - the url path to start file search
// @param {array} filelist - an array of file urls
// @return {array} filelist - the updated array with the new file urls
export const getFileList = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {

    // check if directory
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      // if so call method on this directory
      ? getFileList(path.join(dir, file), filelist)
      // if not then update filelist array
      : filelist.concat(path.join(dir, file));

  });
  return filelist;
}


// ------------------------------------------
// -- Site Compilation Actions --------------
// ------------------------------------------

// Paginate a given list of items
// @param {array} list - the list to be paginated
// @param {integer} ppp - post per page
// @return {array} - an array of arrays
export const paginate = (list, ppp = 5) => {
  // find number of pages needed
  const pages = Math.ceil(list.length / ppp);
  // create array to be returned
  const paginatedList = [];

  // initialize start and stop points
  let start = 0;
  let end = ppp;
  // slice off the amount of ppp
  for (let i = 0; i < pages; i++) {
    paginatedList[i] = {
      pages,
      page: i,
      list: list.slice(start, end)
    }
    //kick up the start and stop for the slice
    start = end;
    end += ppp;
  }

  return paginatedList;
}

// Struncture the nav objects to pass to ejs
// @param {object} linkNames -  array of page names and array of cat naems
// @param {boolean} highlight - boolean to determine whether to render highlighted post nav
// @return {array} navArray - the array of nav objects to pass to ejs
export const buildNav = async (linkNames, highlight = false) => {
  // function that returns nav link object
  const createLink = (name, ext = true) => {
    return {
      Link: ext ? `${name}.html` : name,
      Text: name
    }
  }

  // create navArray that will be returned and push the page link objects
  const navArray = await linkNames.pages.map((linkname) => {
    //create link object to be passed into nav and subnav array
    return createLink(linkname);
  })

  // category link that will contain subnav
  const catagories = {
    Text: `catagories`,
    Sub: await linkNames.catagories.map((linkname) => {
      //create link object to be passed into nav and subnav array
      return createLink(linkname, false);
    }),
  }

  if (typeof highlight === 'string') {
    // highlight link that will contain subnav
    const highlightNav = {
      Text: highlight,
      Sub: await linkNames.highlightCatagories.map((linkname) => {
        //create link object to be passed into nav and subnav array
        return createLink(linkname, false);
      }),
    }
    navArray.push(highlightNav, catagories);
  } else {
    navArray.push(catagories);
  }
  return navArray
};

// Create post list for each catagory
// @param {array} list - array of catagory names
// @param {array} posts - array of all post objects to be sorted
// @return {Object} tagPostObject - Object of tag named arrays of post objects
export const makeTagPostList = (list, posts) => {
  let tagPostObject = {};
  list.map(item => {
    tagPostObject[item] = [];
    //create tag list and push each post with the tag to its list
    posts.map(post => {
      if (post.attributes.tags.includes(item)) {
        tagPostObject[item].push(post);
      }
    });
  });
  return tagPostObject;
};

// Render static pages to docs folder
// @param {array} posts - list of post
// @param {array} nav - array of nav objects to pass to ejs template
// @param {string} type - what type of page to render (list, home,  post, page)
const renderPages = (posts, nav, type = 'list') => {
  let html = null;
  let template = fs.readFileSync('src/views/index.ejs', 'utf-8');
  let renderedPageUrl = null;

  
  switch (type) {
  case 'list':
    //create tag list pages
    renderedPageUrl = (post, tag, i) => (post.page === 0) ? `docs/${tag}/index.html` : `docs/${tag}/index-${i}.html`;
    break;
  case 'home':
    //create home page
    renderedPageUrl = (post, i) => (post.page === 0) ? `docs/index.html` : `docs/index-${i}.html`;
    break;
  case 'post':
    //create static post files
    template = (post) => fs.readFileSync(`src/views/post.ejs`, 'utf-8');
    renderedPageUrl = (post) => `docs/post/${post.name}.html`
    break;
  default:
    //create non post pages
    template = (post) => fs.readFileSync(`src/views/pages/${post}.ejs`, 'utf-8');
    renderedPageUrl = (post) => `docs/${post}.html`;
    break;
  }

  //create static post files
  posts.map(post => {
    template(post);
    renderedPageUrl(post)
    html = ejs.render(template, {
      nav,
      post,
      body: post.body,
      filename: __dirname.replace('/server', '') + '/src/views/static.ejs'
    });
    writeFile(renderedPageUrl, html);
  });
};
