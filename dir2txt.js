let fs = require('fs');
let path = require('path');
let Readable = require('stream').Readable;

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
