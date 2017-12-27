import { writeFile, getFileList, parseFile } from './utils';
import config from '../site.config';

// create array to store list of post
let postList = {};

//create an array to store the tags which will make up our catagory sub nav
let subNav = [];

//map through list of file names and populate both nav and postList
const createPostItems = getFileList(`./src/post/`).map(url => {
  const item = parseFile(url);
  postList[item.name] = item;

  //add post tags array to nav array to get filtered (no dupes) and alphabatized
  subNav = subNav.concat(item.attributes.tags).reduce((a, b) => {
    if (a.indexOf(b) < 0) {
      a.push(b);
    }
    return a;
  }, []).sort();
});

// wrap map in promise so we can chain the write function and execute only once
// postList object is populated with data
Promise.all(createPostItems).then(() => {
  console.log(`This is wut up: ${JSON.stringify(subNav, null, 2)}`);
  // create post data object and populate with config settings, catagories, and postItems
  const postData = {
    // {string} - name of highlight list
    highlight: config.highlight,
    // {array} - The cats collected by createPostItems
    catagories: subNav,
    // {object} - all the post data
    post: postList,
    // {integer} - number of post to list before pagination
    pagination: config.pagination,
  }

  // create json file with post data.
  writeFile(
    'tmp/data/post.json',
    JSON.stringify(postData, null, 2),
    'post.json file written',
  );
}).catch((err) => {
  console.log('ERROR:', err);
});










// const recursiveDir = route => {
//   // console.log("Fuck DOG FUCK: ", route);

//   //get directory post
//   fs.readdir(route, (err, posts) => {

//     //if error in getting
//     if (err) { throw err; }

//     // //create array to store list of post
//     let postList = {};

//     //create an array to store the tags which will make up our nav
//     let nav = [];

//     //map through each post and pull out the data
//     posts.map(_async_(post => {
//       const fileName = post;
//       // console.log("ROUTE: ", route);
//       // console.log("POST: ", post);
//       if (fs.statSync(`${route}${fileName}`).isDirectory()) {
//         recursiveDir(`${route}${fileName}/`);
//       } else {
        
//         //get yaml front matter from each post file
//         _await_(fs.readFile(`${route}${fileName}`, 'utf8', (err, data) => {
//           console.log("FUCKKKKKKKKKK: ");
//           //if error in getting
//           if (err) { throw err; }

//           //pull yaml front matter
//           const content = fm(data);
//           const postData = content.attributes;

//           //parse markdown and store the html
//           postData.body = md.render(content.body);

//           //get file name and remove extension
//           postData.filename = fileName.replace(/\.[^/.]+$/, "");

//           //push new post object onto list array
//           postList[fileName] = postData;

//           //add post tags array to nav array to get filtered (no dupes)
//           nav = nav.concat(postData.tags).reduce((a, b) => {
//             if (a.indexOf(b) < 0) {
//               a.push(b);
//             }
//             return a;
//           }, []);
//         }));
//       }
//       //write to file
//       console.log("POST: ", JSON.stringify(postList, null, 2));
//       //create json file with post data.
//       writeFile(
//         'tmp/data/post.json',
//         JSON.stringify(postList, null, 2)
//       );

//       //create json file with post data.
//       writeFile(
//         'docs/static/data/post.json',
//         JSON.stringify(postList, null, 2),
//         chalk.red.bold(`SAVED TO POST.JSON: ${fileName}`)
//       );
//     }));
//   });
// };

// recursiveDir(`./src/post/`);
