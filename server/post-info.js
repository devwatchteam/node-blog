const fs = require('fs');
const fm = require('front-matter');
const md = require('markdown');


const poster = () => {
  fs.readdir(`./src/post/`, (err, posts) => {
    //if error in getting
    if (err) throw err;
    //create array to store list of post
    let postList = {};
    //create an array to store the tags which will make up our nav
    let nav = [];
    posts.map((post, i) => {
      const fileName = post;
      //get yaml front matter from each post file
      fs.readFile(`./src/post/${fileName}`, 'utf8', (err, data) => {
        //if error in getting
        if (err) throw err;
        //pull yaml front matter
        const content = fm(data);
        const postData = content.attributes;
        postData.body = md.markdown.toHTML(content.body);
        postData.filename = fileName.slice(0, -3);
        //push new post object onto list array
        postList[fileName] = postData;
        //add post tags array to nav array to get filtered
        nav = nav.concat(postData.tags).reduce((a, b) => {
          if (a.indexOf(b) < 0 ) a.push(b);
          return a;
        },[]);
        fs.writeFile('src/data/post.json', JSON.stringify(postList, null, 4), (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        });
      });
    });
  });
};
poster();
