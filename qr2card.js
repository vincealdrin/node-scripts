const fs = require('fs');
const path = require('path');
const lwip = require('lwip'); // npm i lwip

const args = [
  process.argv[2],
  process.argv[3],
  Number(process.argv[4]),
  Number(process.argv[5]),
  process.argv[6],
];

/**
 * Pastes qr code images into card layout
 * @param {string} cardPath - The path to card layout
 * @param {string} qrsPath - The path to qr code images
 * @param {number=} top - The top coordinates of the top-left corner of the pasted image
 * @param {number=} left - The left coordinates of the top-left corner of the pasted image
 * @param {string=} ext - The file extension of the card images(jpg, png)
 */
(function qr2card(cardPath, qrsPath, top = 0, left = 0, ext = 'jpg') {
  fs.readdir(qrsPath, (err, qrs) => {
    console.log(qrs);
    if (err) return console.log(err);
    qrs.forEach(qrFile => {
      lwip.open(cardPath, (err, card) => {
        if (err) return console.log(err);
        lwip.open(`./qr/${qrFile}`, (err, qr) => {
          if (err) return console.log(err);
          card.paste(top, left, qr, (err, pasted) => {
            if (err) return console.log(err);
            fs.mkdir('./cg-cards', () => {
              const qrExt = path.extname(qrFile);
              const cardName = path.basename(qrFile, qrExt);
              pasted.writeFile(`./cg-cards/${cardName}.${ext}`, err => {
                if (err) return console.log(err);
                console.log(`${cardName}.${ext} finished!`);
              });
            });
          });
        });
      });
    });
  });
}(...args));

