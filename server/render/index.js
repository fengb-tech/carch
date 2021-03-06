var _ = require('lodash')

var fs = require('fs')
var markdown = require('markdown-it')()
var browserify = require('browserify-middleware')

var stylish = require('stylish')
var autoprefixer = require('autoprefixer-stylus')

var blog = require('./blog')

exports.template = function(view){
  return function(req, res){
    res.render(view, {
      bodyClass: 'p-' + _.kebabCase(view)
    })
  }
}

exports.markdownFile = function(filename, options){
  options = options || {}

  var view = options.view || 'wrapper'
  return function(req, res){
    fs.readFile(filename, function(err, file){
      res.render(view, _.defaults(options, {
        content: markdown.render(file.toString()),
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
    fileExtension: '.md',
    renderIndex: function(req, res, articles){
      res.render('blog/index', {
        bodyClass: 'blog-index',
        articles: articles,
      })
    },
    renderArticle: function(req, res, options){
      res.render('blog/article', _.extend(options, {
        bodyClass: 'blog',
        content: markdown(options.content),
      }))
    },
  }))
}
