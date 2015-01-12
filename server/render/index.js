var _ = require('lodash')

var fs = require('fs')
var markdown = require('marked')
var browserify = require('browserify-middleware')

var stylish = require('stylish')
var autoprefixer = require('autoprefixer-stylus')

exports.template = function(name){
  return function(req, res){
    res.render(name)
  }
}

exports.markdownFile = function(filename, template){
  template = template || 'wrapper'
  return function(req, res){
    fs.readFile(filename, function(err, data){
      res.render(template, {
        content: markdown(data.toString())
      })
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

exports.blog = require('./blog')
