const fs = require('fs');

function writeFilePromise (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), err => {
      if (err) reject(err);
      else resolve(true);
    });
  })
}

function readFilePromise (path) {
  return new Promise((resole, reject) => {
    fs.readFile(path, { encoding: 'UTF-8' }, (err, data) => {
      if (err) reject(err);
      else {
        if(data) {
          resole(JSON.parse(data));
        }
        else {
          resole(null)
        }
      }
    });
  });
}

module.exports = {writeFilePromise,readFilePromise};
