var appRoot = require('app-root-path')

var express = require('express')
var browserify = require('browserify-middleware')
var stylish = require('stylish')
var autoprefixer = require('autoprefixer-stylus')
var markdown = require('marked')
var fs = require('fs')

var app = module.exports = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/', function(req, res){
  res.render('carch')
})

app.get('/about', function(req, res){
  fs.readFile(appRoot + '/README.md', function(err, data){
    if(err) throw err
    res.render('wrapper', { content: markdown(data.toString()) })
  })
})

app.use(stylish({
  src: appRoot + '/styles',
  setup: function(renderer) {
    return renderer.use(autoprefixer())
  }
}))

app.get('/carch.js', browserify(appRoot + '/browser/carch.js'))

app.use(express.static(appRoot + '/public'))
