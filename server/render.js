var fs = require('fs')
var markdown = require('marked')
var browserify = require('browserify-middleware')

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
