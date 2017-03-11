import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';
import fm from 'front-matter';
import {markdown as md} from 'markdown';
import async from 'async';
import path from 'path';

//set up express server
const app = express();
//find out node environment
const NODE_ENV = process.env.NODE_ENV || 'development';
//change directory context when in dev
const ROOT_DIR = __dirname.replace('/server', '');
//check port
const port = process.env.PORT || 3000;
//define navigation
const nav = [{
  Link:'/javascript',
  Text: 'JavaScript'
}, {
  Link:'/pwa',
  Text: 'PWA'
}];


// ---------------------
// -- some middleware --
// ---------------------
//serve static files
app.use(express.static(__dirname + '/public'));
//check if we are in dev or prod
(NODE_ENV === 'development') ? app.use(morgan('dev')) : app.use(compression());


// ---------------------
// --   templating    --
// ---------------------

app.set('views', 'src/views');
app.set('view engine', 'ejs');

// ---------------------
// --     routes      --
// ---------------------

//create list from post directory
app.get('/', (req, res) => {
  fs.readdir(`./src/post/`, (err, items) => {
    if (err) throw err;
    const list = [];
    const read = (index) => {
      //if all read then render the list of post
      if(index === items.length) {
        console.log("Done reading files");
        res.render('index', {
            title: "sup dunny",
            nav: nav,
            list: list
        });
      } else {
        //get yaml front matter from each post file
        fs.readFile(`./src/post/${items[index]}`, 'utf8', (err, data) => {
          if (err) throw err;
          const content = fm(data);
          const postData = content.attributes;
          postData.filename = items[index];
          list.push(postData);
          read(index + 1);
        });
      }
    };
    read(0);
  });
});

//create list from tags
app.get('/:tag', (req, res) => {
  fs.readdir(`./src/post/`, (err, items) => {
    if (err) throw err;
    const list = [];
    const read = (index) => {
      //if all read then render the list of post
      if(index === items.length) {
        console.log("Done reading files");
        list.filter
        res.render('index', {
            title: "sup dunny",
            nav: nav,
            list: list
        });
      } else {
        //get yaml front matter from each post file
        fs.readFile(`./src/post/${items[index]}`, 'utf8', (err, data) => {
          if (err) throw err;
          const content = fm(data);
          const postData = content.attributes;
          postData.filename = items[index];
          const postTags = postData.tags
          if(postTags.includes(req.params.tag)){
            console.log('POST TAGS:', postTags);
            list.push(postData);
          }

          read(index + 1);
        });
      }
    };
    read(0);
  });
});

//render single post
app.get('/post/:post', (req, res) => {
  //get yaml front matter and body of post
  fs.readFile(`./src/post/${req.params.post}`, 'utf8', (err, data) => {
    if (err) throw err;
    const content = fm(data);
    const body = md.toHTML(content.body);
    console.log(content.frontmatter);
    //once read render single post
    res.render('post', {
        title: "sup dunny",
        nav: nav,
        post: content,
        body: body
    });
  });
});

app.use(express.static(ROOT_DIR + '/src'));
app.use(express.static(__dirname + '/src'));

//have express listen for request
const server = app.listen(port, () => {
  const host = server.address().address || 'localhost';
  console.log('Your awesome app listening at http://%s:%s', host, port);
});
