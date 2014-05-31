var store = require('file-store')(__dirname + '/onebushome.json');
var mac = require('getmac');
var http = require('http');

var hwAddr;
mac.getMac(function(err,macAddress){
    if (err)  throw err;
    hwAddr = macAddress;
});

var nbad = 0;
var pingServer = function(cb) {
  http.get("http://quimian.com/oba.json?id=" + hwAddr, function(serv) {
    if (serv.statusCode === 200) {
      // Connectivity!
      var body = '';
      serv.on('data', function(chunk) {
        body += chunk;
      });
      serv.on('end', function() {
        var data = JSON.parse(body);
        for(var key in data) {
          store.set(key, data[key], function() {});
        }
        data.okay = true;
        cb(data);
        nbad = 0;
      });
    } else {
      nbad ++;
      if (nbad > 10) {
        nbad = 0;
        cb({redirect:'/'});
      }
    }
  }).on('error', function(e) {
    nbad ++;
    if (nbad > 10) {
      nbad = 0;
      cb({redirect:'/'});
    }
  });
}

module.exports = function(app) {
  app.get(function(req, res) {
    // We're All Good, Show the UI :D
    if (req.query.check === 'ajax') {
      // Allowed keys: 'msg', 'reload'
      pingServer(function(resp) {
        res.json(resp);
      });
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
