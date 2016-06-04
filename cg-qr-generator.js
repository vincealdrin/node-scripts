var fs = require('fs');
var rl = require('readline');
var qr = require('qr-image'); //npm i qr-image
var Readable = require('stream').Readable;

var args = [
  process.argv[2],
  process.argv[3],
  process.argv[4],
  process.argv[5],
  process.argv[6],
];

/**
 * Generates qr code images and new .txt file if serials are not seperated by \n
 * @param {string} path - The path to .txt file containing 10 digit serial number
 * @param {string=} delimiter - The path to .txt file containing 10 digit serial number(Default is \n)
 * @param {string=} type - The image file type(png, svg, pdf, eps)
 * @param {number=} size - The qr code image resolution size(png & svg only)
 * @param {string=} ec_level - The error correction level standard(L, M, H, Q)
 */
(function(path, delimiter = '\n', type = 'png', size = 40, ec_level = 'L') {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return console.log(err);
    let serials = data.replace(/\n$/, '').split(delimiter);

    serials.pop();
    console.log(serials);
    fs.mkdir('./qr-codes', err => {
      if (err) return console.log(err);
      let readStream = new Readable;
      let writeStream = fs.createWriteStream('./serial-per-line.txt');
      let lineReader = rl.createInterface({
        input: fs.createReadStream('./serial-per-line.txt')
      });

      serials.forEach(serial => {
        qr.image(serial, { type, size, ec_level })
        .pipe(require('fs').createWriteStream(`./qr-codes/${serial}.${type}`));
        readStream.push(`${serial}\n`);
      });

      readStream.push(null);
      if (delimiter !== '\n') {
        readStream.pipe(writeStream);
      }
    });
  });
})(...args)
