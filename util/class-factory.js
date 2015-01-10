var _ = require('lodash')

function namedFunc(name, anonFunc){
  // This is so fugly.  We parse the function body, replace
  // the name with our new name, and eval it back together.
  var funcBody = anonFunc.toString().replace(/function.*?\(/, 'return function '+ name +'(')
  return new Function(funcBody)() // jshint ignore:line
}

var fid = 1
function nextFid(){
  return fid++
}

var classFactory = module.exports = function(callback){
  var Class = function(options){
    this._assignFid()
    if(this.init){
      this.init(options)
    }
  }
  if(callback.name){
    Class = namedFunc(callback.name, Class)
  }

  var proto = Class.prototype

  Class.create = function(options){
    return new Class(options)
  }

  Class.supers = []
  Class.inherits = function(){
    for(var i=0; i < arguments.length; i++){
      var Super = arguments[i]
      Class.supers.push(Super)

      // Not using the prototype chain because:
      //   1. this is faster for lookups
      //   2. this allows for multiple "inheritance"
      //
      // Drawback is that if Super has dynamic methods, this won't pick it up.
      _.extend(proto, Super.prototype)
    }
  }

  proto.superInit = function(){
    for(var i=0; i < Class.supers.length; i++){
      var Super = Class.supers[i]
      Super.apply(this, arguments)
    }
  }
  proto.init = proto.superInit
  proto._assignFid = function(){
    if(!this._fid){
      this._fid = nextFid()
    }
  }
  proto.toString = function(){
    return '<' + Class.name + '-' + this._fid + '>'
  }

  callback.call(Class, proto)

  return Class
}
