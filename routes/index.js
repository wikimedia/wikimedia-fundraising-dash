exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.library = function(req, res){
  res.render('library', { title: 'Express' });
};

exports.tests = function(req, res){
  res.render('tests', { title: 'Express' });
};
