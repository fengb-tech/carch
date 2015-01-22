var express = require('express')
var appRoot = require('app-root-path')

var render = require('carch/server/render')

var app = module.exports = express()

app.set('view engine', 'jade')
app.locals.basedir = app.get('views')

app.get('/',             render.template('carch'))
app.get('/benchmark',    render.template('benchmark'))
app.get('/about',        render.markdownFile(appRoot + '/README.md', { bodyClass: 'p-about' }))
app.get('/contact',      render.template('contact'))
app.use('/blog',         render.blog(appRoot + '/views/blog'))

app.get('/carch.js',     render.browserify(appRoot + '/browser/carch.js'))
app.get('/benchmark.js', render.browserify(appRoot + '/browser/benchmark.js'))

app.use(render.stylish(appRoot + '/styles'))
app.use(express.static(appRoot + '/public'))
