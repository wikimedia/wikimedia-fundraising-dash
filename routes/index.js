exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.library = function(req, res){
  res.render('library', { title: 'Library' });
};

exports.tests = function(req, res){
  res.render('tests', { title: 'Tests' });
};
