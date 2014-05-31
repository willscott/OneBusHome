var express = require('express');
var router = express.Router();

// A connected request:
router.get('/online/:id', function(req, res) {
  // 2. Redirect to configuration if not configured.
  

  // 3. We're All Good, Show the UI :D
  res.render('index', { title: 'Express' });
});

module.exports = router;
