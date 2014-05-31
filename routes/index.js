var express = require('express');
var http = require('http');
var mac = require('getmac');
var setup = require('setup')();
var hwAddr;
var store = require('file-store')(__dirname + '/onebushome.json');

mac.getMac(function(err,macAddress){
    if (err)  throw err;
    hwAddr = macAddress;
});

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
    http.get("http://quimian.com/oba.conf?id=" + hwAddr, function(serv) {
      if (serv.statusCode === 200) {
        // Connectivity!
        serv.on('data', function (chunk) {
          res.redirect('/online?id=' + chunk);
        });
      } else {
        store.load('wifi', function(err, wifi) {
          if (!err && wifi.length) {
            doWifi(wifi[0]);
          }
        });
        res.render('setup', { mac: hwAddr, status: serv.statusCode, ssid:ssids });
      }
    }).on('error', function(e) {
      res.render('setup', { mac: hwAddr, status: e, ssid:ssids });
    });
  });
};
