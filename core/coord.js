var classFactory = require('carch/util/class-factory')

module.exports = classFactory(function Coord(proto){
  var Class = this

  proto.init = function(options){
    if(options) {
      this.x = options.x
      this.y = options.y
    }
  }

  proto.lerp = function(to, frac, target){
    target = target || Class.create()
    target.x = this.x + (to.x - this.x) * frac
    target.y = this.y + (to.y - this.y) * frac
    return target
  }
})
