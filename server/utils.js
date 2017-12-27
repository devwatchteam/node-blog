import fs from 'fs';
import fm from 'front-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';
import mkdirp from 'mkdirp';
import path, { dirname } from 'path';
import config from '../site.config';

// parse markdown to add highlight classes and reformat for line numbers
// @param {object} - init object defining the highlight function
const md = new markdown({
  highlight: function (str) {
    //create line numbers for code block
    let lineNumber = 0;

    //pass in names of languages to autodetect and highlight
    const hl = hljs.highlightAuto(str, ['html', 'javascript', 'css', 'sass', 'shell']).value;

    //create regex literal to search for
    const commentPattern = /<span class="hljs-comment">(.|\n)*?<\/span>/g;

    //This puts comments on a newline so that a line number will be added to comments as well
    const adaptedHighlightedContent = hl.replace(commentPattern, data => {
      return data.replace(/\r?\n/g, () => {
        return '\n<span class="hljs-comment">';
      });
    });

    // wraps the line number and content line in markup that will provide our highlight styles
    const contentBlock = adaptedHighlightedContent.split(/\r?\n/).map(lineContent => {
      return `<div class="code-line">
                <span class="code-line-number" data-pseudo-content=${++lineNumber}></span>
                <span class="code-line-content">${lineContent}</span>
              </div>`
    }).join('');

    return `<pre class="code">
              <code class="code-block">${contentBlock}</code>
            </pre>`;
  }
});

// Retrieve file name, attributes and body of specified file
// @param {string} url - the url path of file to be parsed
// @return {object} - Post object that contains name of file, attributes, body, highlighted post boolean
export const parseFile = (url) => {
  const data = fs.readFileSync(url, 'utf8');
  // pull yaml front matter
  const content = fm(data);

  //get catagories
  const cat = content.attributes.catagory;

  //create post object
  const fileContent = {
    // use url to get filename and remove the extension
    // {string}
    name: url.substr(url.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, ""),
    // grab YAML front matter
    // {object} -> title:<string>, desc:<string>, author:<string>, tags:<array>, date:<string>, highlight:<boolean>
    attributes: content.attributes,
    // parse markdown and store the html
    body: md.render(content.body),
    // check if post contained a tutorial tag
    // {boolean}
    highlight: cat ? cat.includes(config.highlight) : false,
  }
  return fileContent;
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
