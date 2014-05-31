
module.exports = function(app) {
  app.get(function(req, res) {
    // We're All Good, Show the UI :D
    if (req.query.id) {
      res.render('online', {
        id: req.query.id,
        stop: "http://pugetsound.onebusaway.org/where/sign/stop.action?id=" + req.query.id
      });
    } else {
      res.render('stop');
    }
  });
};
