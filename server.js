var express = require('express')
var browserify = require('browserify-middleware')
var app = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/', function(req, res){
  res.render('home')
})

app.get('/cate.js', browserify('./browser/cate.js'))

var port = Number(process.env.PORT || 5000)
var server = app.listen(port, function (){
  console.log('CATE started on', port)
})
