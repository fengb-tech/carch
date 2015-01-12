var _ = require('lodash')
var S = require('string')

var fs = require('fs')
var markdown = require('marked')
var browserify = require('browserify-middleware')

var stylish = require('stylish')
var autoprefixer = require('autoprefixer-stylus')

var blog = require('./blog')

exports.template = function(view){
  return function(req, res){
    res.render(view, {
      bodyClass: 'p-' + S(view).slugify().s
    })
  }
}

exports.markdownFile = function(filename, options){
  options = options || {}

  var view = options.view || 'wrapper'
  return function(req, res){
    fs.readFile(filename, function(err, file){
      res.render(view, _.defaults(options, {
        content: markdown(file.toString()),
      }))
    })
  }
}

exports.browserify = browserify

exports.stylish = function(options){
  if(_.isString(options)){
    options = { src: options }
  }

  return stylish(_.defaults(options, {
    setup: function(renderer) {
      return renderer.use(autoprefixer())
    }
  }))
}

exports.blog = function(options){
  if(_.isString(options)){
    options = { src: options }
  }

  return blog(_.defaults(options, {
    fileExtension: 'md',
    render: function(req, res, content){
      res.render('blog/page', {
        bodyClass: 'blog',
        content: markdown(content),
      })
    }
  }))
}
