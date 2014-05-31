
module.exports = function(app) {
  app.get(function(req, res) {
    // 3. We're All Good, Show the UI :D
    res.render('online', { id: req.params.mac });
  });
};
