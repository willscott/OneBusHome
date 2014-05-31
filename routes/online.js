var store = require('file-store')(__dirname + '/onebushome.json');

module.exports = function(app) {
  app.get(function(req, res) {
    // We're All Good, Show the UI :D
    if (req.query.check === 'ajax') {
      // Allowed keys: 'msg', 'reload'
      res.json({});
      return;
    } else if (req.query.id) {
      store.get('stop', function(err, stop) {
        if (!err && !stop) {
          store.set('stop',{
            value:req.query.id
          }, function() {});
        }
      });
      res.render('online', {
        id: req.query.id,
        stop: "http://pugetsound.onebusaway.org/where/sign/stop.action?id=" + req.query.id
      });
    } else {
      store.get('stop', function(err, stop) {
        if (!err && stop) {
          res.redirect('/online?id=' + stop.value);
        } else {
          res.render('stop');
        }
      });
    }
  });
};
