import express from 'express';
import morgan from 'morgan';
import chalk from 'chalk';

import postRoutes from './routes/post-routes';

//set up express dev server
const app = express();

//change directory context when in dev
const ROOT_DIR = __dirname.replace('/server', '/docs');

//check port
const port = process.env.PORT || 5000;

// ---------------------
// -- some middleware --
// ---------------------

//serve static files
app.use(express.static(ROOT_DIR));

//use logger to monitor request.
app.use(morgan('dev'));

// ---------------------
// --     routes      --
// ---------------------

//handle request with routes
app.use(`/`, postRoutes);

//any other request redirect to home
app.use((req, res) => {
  res.redirect(`/`);
});

//have express listen for request
app.listen(port, () => {
  console.log(chalk.bgWhite.blue(` Your awesome blog is listening at ${chalk.bgWhite.blue.underline('http://localhost:%s')} `), port);
});
