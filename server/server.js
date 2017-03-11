import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';
import fm from 'front-matter';
import markdown from 'markdown';
import post from './postfetch';

const md = markdown.markdown;
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
  Link:'/Books',
  Text: 'Books'
}, {
  Link:'/Authors',
  Text: 'Authors'
}];


// ---------------------
// -- some middleware --
// ---------------------

//check if we are in dev or prod
(NODE_ENV === 'development') ? app.use(morgan('dev')) : app.use(compression());
//serve static files
app.use(express.static(__dirname + 'public'));

// ---------------------
// --   templating    --
// ---------------------

app.set('views', 'src/views');
app.set('view engine', 'ejs');

// ---------------------
// --     routes      --
// ---------------------

app.get('/:post', (req, res) => {

  fs.readFile(`./src/post/${req.params.post}.md`, 'utf8', (err, data) => {
    if (err) throw err
    const content = fm(data);
    const body = md.toHTML(content.body);
    console.log(content.frontmatter);
    return res.render('index', {
        title: "sup dunny",
        nav: nav,
        post: content,
        body: body
    });
  });

});

app.get('/post', (req, res) => {
  res.send(post('webpack2-migration'));
});

//have express listen for request
const server = app.listen(port, () => {
  const host = server.address().address || 'localhost';
  console.log('Your awesome app listening at http://%s:%s', host, port);
});
