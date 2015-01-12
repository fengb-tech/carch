var _ = require('lodash')

var fs = require('fs')
var markdown = require('marked')
var path = require('path')
var url = require('url')

module.exports = function blog(options){
  if(_.isString(options)){
    options = { src: options }
  }

  var src = path.normalize(options.src)
  var ext = 'md'
  var pageTemplate = 'blog/page'
  function render(req, res, data){
    res.render(pageTemplate, {
      content: markdown(data)
    })
  }

  function blogFilename(urlAbs){
    var chunks = urlAbs.split('/')
    return chunks[chunks.length - 1]
  }

  return function stylus(req, res, next){
    if(req.method != 'GET' && req.method != 'HEAD') {
      return next()
    }

    var filename = blogFilename(req.url)
    var filepath = path.normalize(path.join(src, filename + '.' + ext))
    fs.readFile(filepath, function(error, data){
      if(error){
        if(error.code === 'ENOENT') {
          next()
        } else {
          next(error)
        }
        return
      }

      render(req, res, data.toString())
    })
  }
}
