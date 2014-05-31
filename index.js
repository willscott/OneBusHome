var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/static'));
var indexRouter = require('./routes/index')(app.route('/'));
var onlineRouter = require('./routes/online')(app.route('/online'));

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
