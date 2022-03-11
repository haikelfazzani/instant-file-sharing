const fs = require('fs');

function writeFilePromise(path, data = {}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), { encoding: 'utf8', flag: "w+" }, err => {
      if (err) { console.log(err); reject(err); }
      else resolve(true);
    });
  })
}

function readFilePromise(path) {
  return new Promise((resole, reject) => {
    fs.readFile(path, { encoding: 'UTF-8' }, async (err, data) => {
      if (err) {
        console.log(err);
        await writeFilePromise(path);
        resole({});
      }
      else {
        if (data) { resole(JSON.parse(data)); }
        else { resole(null) }
      }
    });
  });
}

module.exports = { writeFilePromise, readFilePromise };
