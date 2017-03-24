import express from 'express';
import morgan from 'morgan';
import path from 'path';
import postRoutes from './routes/post-routes';

//set up express server
const app = express();
//find out node environment
const NODE_ENV = process.env.NODE_ENV || 'development';
//change directory context when in dev
const ROOT_DIR = __dirname.replace('/server', '');
//check port
const port = process.env.PORT || 3000;

// ---------------------
// -- some middleware --
// ---------------------

//serve static files
app.use(express.static(ROOT_DIR + '/src/static'));
app.use(express.static(__dirname + '/src/static'));
app.use(morgan('dev'));

// ---------------------
// --   templating    --
// ---------------------

app.set('views', 'src/views');
app.set('view engine', 'ejs');

// ---------------------
// --     routes      --
// ---------------------

app.use(`/`, postRoutes);
app.use((req, res) => {
    res.redirect(`/`);
});

//have express listen for request
const server = app.listen(port, () => {
  const host = server.address().address || 'localhost';
  console.log('Your awesome app listening at http://%s:%s', host, port);
});
