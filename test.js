const fs = require('fs');
fs.readdir("D:/", (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});
