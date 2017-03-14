const fs = require('fs');
const fm = require('front-matter');

const nav = (cb) => {
  fs.readdir(`./src/post/`, (err, items) => {
    //if error in getting
    if (err) throw err;
    //create array to store list of post
    var list = [];
    //create an array to store the tags which will make up our nav
    var nav = [];
    //function to loop through post items
    const read = (index) => {
      //if all read then sort and pass into object for cb
      if(index === items.length) {
        console.log("Done reading files");
        //sort from newest to oldest
        list.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return ( dateA < dateB) ? 1 : (dateA > dateB) ? -1 : 0;
        });
        //take array of tags and remove dupes
        const uniq = nav.reduce((a, b) => {
          if (a.indexOf(b) < 0 ) a.push(b);
          return a;
        },[]);
        //creat object to pass to cb
        const navList = {
          nav: uniq,
          list: list
        }
        //call cb with passed in object
        cb(navList)
      } else {
        //get yaml front matter from each post file
        fs.readFile(`./src/post/${items[index]}`, 'utf8', (err, data) => {
          //if error in getting
          if (err) throw err;
          //pull yaml front matter
          const content = fm(data);
          const postData = content.attributes;
          postData.filename = items[index];
          //push new post object onto list array
          list.push(postData);
          //add post tags array to nav array to get filtered
          nav = nav.concat(postData.tags);
          //increment loop counter
          read(index + 1);
        });
      }
    };
    //make initial call to loop
    read(0);
  });
};

module.exports = nav;
