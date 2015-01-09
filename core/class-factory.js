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

  Class.create = function(options){
    return new Class(options)
  }

  var proto = Class.prototype
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
