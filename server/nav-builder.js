const fs = require('fs');
import { async as _async_, await as _await_ } from 'asyncawait';


const navigation = _async_(() => {
  let nav = null;
  //get directory post
  _await_ (fs.readdir(`./src/post/`, (err, posts) => {
    if (err) { throw err; }
    posts.map(post => {
      console.log(post);
    });
  }));
  
  return nav;
});

export default navigation;
