import fs from 'fs';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import mkdirp from 'mkdirp';
import {dirname} from 'path';

//using mkdirp to make any missing directories in path for fs.writefile
//make into utils file
const writeFile = (path, contents) => {
  mkdirp(dirname(path), (err) => {
    if (err) throw err;
    fs.writeFileSync(path, contents, 'utf8');
  });
}

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
      writeFile(`src/${process.env.npm_package_reponame}/static/css/main.css`, result.css);
      console.log(`CSS COMPILED`);
    });
});
