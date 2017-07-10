import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import chalk from 'chalk';
import { writeFile } from './utils';


// render sass and process autoprefixer
sass.render({
  file: 'src/sass/main.scss',
  sourceMap: true,
  sourceMapEmbed: true,
  sourceMapContents: true,
  outFile: 'docs/static/css/main.css'
}, (err, result) => {
  postcss([autoprefixer]).process(result.css, {
    from: './docs/static/css/main.css',
    to: './docs/static/css/main.css',
    map: { inline: true },
  })
    .then(result => {
      //write to docs folder
      writeFile(`docs/static/css/main.css`, result.css);

      //write for dev
      // writeFile(`tmp${process.env.npm_package_reponame}/static/css/main.css`, result.css);
      console.log(chalk.red.bold(`CSS COMPILED`));
    });
});
