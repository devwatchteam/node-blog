import { writeFile, getFileList, parseFile } from './utils';
import config from '../site.config';

// create array to store list of post objects
let postList = [];

// create array to store list of highlight post objects
let highlightPostList = [];

// create an array to store the tags which will make up our catagory sub nav
let subNav = [];

//map through list of file names and populate both nav and postList
const createPostItems = getFileList(`./src/post/`).map(url => {
  // parse post and get the returned post object
  const item = parseFile(url);

  // if tagged as highlighted push to highligtPostList array or else push to postList
  item.highlight ? highlightPostList.push(item) : postList.push(item);

  // add post tags array to nav array to get filtered (no dupes) and alphabatized
  subNav = subNav.concat(item.attributes.tags).reduce((a, b) => {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }
    return a;
  }, []).sort();
});

/*
  wrap map in promise so we can chain the write function and execute only once
  postList array is populated with data
*/
Promise.all(createPostItems).then(() => {
  console.log(`This is wut up: ${JSON.stringify(postList, ['name'], 2)}`);
  // create post data object and populate with config settings, catagories, and postItems
  const postData = {
    // {string} - name of highlight list
    highlight: config.highlight || false,
    // {array} - List of static pages
    pages: getFileList(`./src/views/pages`).map(url => url.substr(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, "")),
    // {array} - The cats collected by createPostItems
    catagories: subNav.length > 1 ? subNav : false,
    // {array} - of all the post objects
    post: postList,
    // {array} - of all the highlighted post objects
    highlightedPost: highlightPostList,
    // {integer} - number of post to list before pagination
    pagination: config.pagination,
  }

  // create json file with post data.
  writeFile(
    'tmp/data/post.json',
    JSON.stringify(postData, null, 2),
    'File written to post.json',
  );
}).catch((err) => {
  console.log('ERROR:', err);
});
