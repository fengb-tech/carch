var appRoot = require('app-root-path')

var express = require('express')
var browserify = require('browserify-middleware')
var stylish = require('stylish')

var app = module.exports = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/', function(req, res){
  res.render('carch')
})

app.use(stylish({ src: appRoot + '/styles' }))

app.get('/carch.js', browserify(appRoot + '/browser/carch.js'))

app.use(express.static(appRoot + '/public'))
