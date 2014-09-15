var path = require('path')
require('fs').readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  })
  .forEach(function(file) {
    exports[file.substr(0,file.length - 3)] = require(path.join(__dirname, file));
});
