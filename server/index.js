var carchPath = require('app-root-path')
var express = require('express')
var browserify = require('browserify-middleware')
var app = module.exports = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/', function(req, res){
  res.render('carch')
})

app.get('/carch.js', browserify('browser/carch.js'))

app.use(express.static(carchPath + '/public'))
