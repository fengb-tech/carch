var _ = require('lodash')

var cfId = 1
function nextCfId(){
  return cfId++
}

var classFactory = module.exports = function(cfName, callback){
  var Class = function(options){
    this.cfId = nextCfId()
    if(this.init){
      this.init(options)
    }
  }

  var proto = Class.prototype

  Class.cfName = proto.cfName = cfName

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
  proto.toString = function(){
    return '<' + Class.cfName + '-' + this.cfId + '>'
  }

  callback.call(Class, proto)

  return Class
}
