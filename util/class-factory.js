var _ = require('lodash')

var cfId = 1
function nextCfId(){
  return cfId++
}

module.exports = function classFactory(cfName, callback){
  var Class = function(){
    this.cfId = nextCfId()
  }

  var proto = Class.prototype

  Class.cfName = proto.cfName = cfName

  Class.cfPool = []
  Class.create = function(){
    var instance = Class.cfPool.pop() || new Class()
    instance.superInits.apply(instance, arguments)
    if(instance.init){
      instance.init.apply(instance, arguments)
    }
    return instance
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

  proto.destroy = function(){
    var keys = Object.keys(this)
    for(var i = 0; i < keys.length; i++){
      var key = keys[i]
      if(key !== 'cfId'){
        delete this[key]
      }
    }

    Class.cfPool.push(this)
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
