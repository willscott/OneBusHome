var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var indexRouter = require('./routes/index');
var onlineRouter = require('./routes/online');
app.use('/', indexRouter);
app.use('/online', onlineRouter);

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
