var express = require('express');
var http = require('http');
var mac = require('getmac');
var hwAddr;

mac.getMac(function(err,macAddress){
    if (err)  throw err;
    hwAddr = macAddress;
});

module.exports = function(app) {
  app.get(function(req, res) {
    // 1. Redirect to setup if no connectivity.
    http.get("http://quimian.com/oba.conf?id=" + hwAddr, function(serv) {
      if (serv.statusCode === 200) {
        // Connectivity!
        serv.on('data', function (chunk) {
          res.redirect('/online?id=' + chunk);
        });
      } else {
        res.render('setup', { mac: hwAddr, status: serv.statusCode });
      }
    }).on('error', function(e) {
      res.render('setup', { mac: hwAddr, status: e });
    });
  });
};
