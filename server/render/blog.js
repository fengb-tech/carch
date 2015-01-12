var _ = require('lodash')
var S = require('string')

var fs = require('fs')
var path = require('path')
var XRegExp = require('xregexp').XRegExp

var YYYY_MM_DD_ARTICLE = XRegExp('(?<year>  [0-9]{4}) - ' +
                                 '(?<month> [0-9]{2}) - ' +
                                 '(?<day>   [0-9]{2}) - ' +
                                 '(?<name>  .*)', 'x')

module.exports = function blog(options){
  var src = path.normalize(options.src)
  var fileExtension = options.fileExtension
  var renderIndex = options.renderIndex
  var renderArticle = options.renderArticle

  function blogFilename(urlAbs){
    var chunks = urlAbs.split('/')
    return chunks[chunks.length - 1]
  }

  function articleFromFilename(filename){
    var article = XRegExp.exec(filename, YYYY_MM_DD_ARTICLE)
    article.path = article.input
    article.title = S(article.name).capitalize().s
    return article
  }

  function articlesFromFiles(files, callback){
    callback(_.chain(files)
      .filter(function(file){ return path.extname(file) === fileExtension })
      .map(function(file){
        var basename = path.basename(file, fileExtension)
        return articleFromFilename(basename)
      })
      .value()
    )
  }

  return function stylus(req, res, next){
    if(req.method != 'GET' && req.method != 'HEAD') {
      return next()
    }

    var filename = blogFilename(req.url)
    if(filename.length === 0){
      fs.readdir(src, function(err, files){
        if(err){
          next(err)
        }
        articlesFromFiles(files, function(articles){
          renderIndex(req, res, articles)
        })
      })
    } else {
      var filepath = path.normalize(path.join(src, filename + fileExtension))
      fs.readFile(filepath, function(err, fd){
        if(err){
          if(err.code === 'ENOENT'){
            next()
          } else {
            next(err)
          }
        } else {
          var article = articleFromFilename(filename)
          article.content = fd.toString()
          renderArticle(req, res, article)
        }
      })
    }
  }
}
