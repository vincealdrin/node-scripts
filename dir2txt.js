let fs = require('fs');
let path = require('path');
let Readable = require('stream').Readable;

/**
 * List all the files in a directory to a .txt 
 * @param {string} dir - The directory you want to list
 * @param {string} txtpath - The path of your .txt
 * @param {string=} filter - The file extension filter(omit ".")
 */
(function dirToTxt(dir, txtpath, filter) {
  let filePath = path.dirname(txtpath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      fs.mkdir(filePath, err => {
        if (err) return console.log(err);
        fs.readdir(dir, (err, files) => {
          if (err) return console.log(err);
          createStream(files, txtpath, filter);
        });
      });
    } else {
      fs.readdir(dir, (err, files) => {
        if (err) return console.log(err);
        createStream(files, txtpath, filter);
      });
    }
  });
})(process.argv[2], process.argv[3], process.argv[4]);

function createStream(list, txtpath, filter) {
  let readStream = new Readable;
  let writeFile = fs.createWriteStream(txtpath);

  let dir = list.filter(file => {
    if (filter) {
      if (path.extname(file) === `.${filter}`) {
        readStream.push(`${file}\n`)
        return file;
      }
    } else {
      readStream.push(`${file}\n`);
      return file;
    }
  });
  readStream.push(null);

  readStream.pipe(writeFile);
  console.log(dir);
}