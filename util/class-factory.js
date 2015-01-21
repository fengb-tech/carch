var _ = require('lodash')

var cfId = 1
function nextCfId(){
  return cfId++
}

var classFactory = module.exports = function(cfName, callback){
  var Class = function(options){
    this.cfId = nextCfId()
    this.superInits()
    if(this.init){
      this.init(options)
    }
  }

  var proto = Class.prototype

  Class.cfName = proto.cfName = cfName

  Class.create = function(options){
    return new Class(options)
  }

  Class.superInits = []
  Class.inherits = function(Super, superInit){
    superInit = superInit || Super

    Class.superInits.push(superInit)

    // Not using the prototype chain because:
    //   1. this is faster for lookups
    //   2. this allows for multiple "inheritance"
    //
    // Drawback is that if Super has dynamic methods, this won't pick it up.
    _.extend(proto, Super.prototype)
  }

  proto.superInits = function(){
    for(var i=0; i < Class.superInits.length; i++){
      var superInit = Class.superInits[i]
      superInit.apply(this, arguments)
    }
  }
  proto.toString = function(){
    return '<' + Class.cfName + '-' + this.cfId + '>'
  }

  callback.call(Class, proto)

  return Class
}
