var express = require('express');
var http = require('http');
var mac = require('getmac');
var setup = require('setup')();
var hwAddr = 0;
var store = require('file-store')(__dirname + '/onebushome.json');

//mac.getMac(function(err,macAddress){
//    if (err)  throw err;
//    hwAddr = macAddress;
//});

var ssids = [];
if (require('os').platform() === 'darwin') {
  // Mac
  var iw = require('wireless-osx');
  var iface = new iw.Airport('en0');
  iface.scan(function(err, results) {
    if (err) {
      ssids = err;
    } else if (results) {
      var sids = {};
      for (var i =0; i < results.length; i++) {
        sids[results[i].SSID] = true;
      }
      ssids = [];
      for (var key in sids) {
        if (sids.hasOwnProperty(key)) {
          ssids.push(key);
        }
      }
    }
  });
} else {
  // Linux
}

module.exports = function(app) {
  app.get(function(req, res) {
    // 1. Redirect to setup if no connectivity.
    console.log(req.params);
    if (req.query.ssid) {
      console.log('setting SSID');
      res.redirect('/online?id=');
      return;
    }
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
          res.redirect('/online');
        });
      } else {
        store.get('wifi', function(err, wifi) {
          if (!err && wifi) {
            doWifi(wifi);
          }
        });
        res.render('setup', { mac: hwAddr, status: serv.statusCode, ssid:ssids });
      }
    }).on('error', function(e) {
      res.render('setup', { mac: hwAddr, status: e, ssid:ssids });
    });
  });
};
