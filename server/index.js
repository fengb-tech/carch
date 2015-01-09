var appRoot = require('app-root-path')

var express = require('express')
var stylish = require('stylish')
var autoprefixer = require('autoprefixer-stylus')
var render = require(appRoot + '/server/render')

var app = module.exports = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/',         render.template('carch'))
app.get('/about',    render.markdownFile(appRoot + '/README.md'))
app.get('/carch.js', render.browserify(appRoot + '/browser/carch.js'))

app.use(stylish({
  src: appRoot + '/styles',
  setup: function(renderer) {
    return renderer.use(autoprefixer())
  }
}))

app.use(express.static(appRoot + '/public'))
