var _ = require('lodash')

var fs = require('fs')
var path = require('path')

module.exports = function blog(options){
  var src = path.normalize(options.src)
  var fileExtension = options.fileExtension
  var render = options.render

  function blogFilename(urlAbs){
    var chunks = urlAbs.split('/')
    return chunks[chunks.length - 1]
  }

  return function stylus(req, res, next){
    if(req.method != 'GET' && req.method != 'HEAD') {
      return next()
    }

    var filename = blogFilename(req.url)
    var filepath = path.normalize(path.join(src, filename + '.' + fileExtension))
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
