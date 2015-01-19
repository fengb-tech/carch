var classFactory = require('carch/util/class-factory')

module.exports = classFactory(function ResourceStation(proto){
  proto.init = function(options){
    this.type = options.type
    this.rate = options.rate
  }
})
