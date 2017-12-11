import fs from 'fs';
import fm from 'front-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import mkdirp from 'mkdirp';
import path, { dirname } from 'path';
import config from '../site.config';

// eslint-disable-next-line
// const utils = module.exports = {};

// parse markdown to add highlight classes and reformat for line numbers
const md = new markdown({
  highlight: function (str) {
    //create line numbers for code block
    let lineNumber = 0;

    //pass in string to be highlighted
    const hl = hljs.highlightAuto(str, ['html', 'javascript', 'css', 'sass', 'shell']).value;

    const commentPattern = /<span class="hljs-comment">(.|\n)*?<\/span>/g;

    const adaptedHighlightedContent = hl.replace(commentPattern, data => {
      return data.replace(/\r?\n/g, () => {
        return '\n<span class="hljs-comment">';
      });
    });

    const contentBlock = adaptedHighlightedContent.split(/\r?\n/).map(lineContent => {
      return `<div class="code-line">
                <span class="code-line-number" data-pseudo-content=${++lineNumber}></span>
                <span class="code-line-content">${lineContent}</span>
              </div>`
    }).join('');

    return `<pre class="code"><code class="code-block">${contentBlock}</code></pre>`;
  }
});

// Retrieve file name, attributes and body of specified file
// @param {string} url - the url path of file to be parsed
// @return {object} - Post object that contains name of file, attributes, body, highlighted post boolean
export const parseFile = (url) => {
  fs.readFile(url, 'utf8', (err, data) => {
    if (err) { throw err; }

    // pull yaml front matter
    const content = fm(data);
    const cat = content.attributes.catagory

    return {
      // use url to get filename and remove the extension
      name: url.substr(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, ""),
      // grab YAML front matter
      attributes: content.attributes,
      // parse markdown and store the html
      body: md.render(content.body),
      // check if post contained a tutorial tag
      highlight: cat ? cat.includes(config.highlight) : false,
    }
  });
};

// write files to a directory/ will create directories that are not present
// @param {string} dir - the url path to write the file to
// @param {object} contents - contents being written to file
// @param {string} msg - message to be consoled out when file is written
// @return {boolean} true - returns true if no errors
export const writeFile = (path, contents, msg = null) => {
  // make directory path if does not exist
  mkdirp(dirname(path), (err) => {
    if (err) { throw err; }

    // write file contents to given path
    fs.writeFileSync(path, contents, 'utf8');

    // log provided or default message
    console.log(msg || `File written!`);
  });
};

// Recursively get an array of file names in a given directory
// @param {string} dir - the url path to start file search
// @param {array} filelist - an array of file urls
// @return {array} filelist - the updated array with the new file urls
export const getFileList = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    // check if directory
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      // if so call method on this directory
      ? getFileList(path.join(dir, file), filelist)
      // if not then update filelist array
      : filelist.concat(path.join(dir, file));

  });
  return filelist;
}


