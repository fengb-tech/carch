var PIXI = require('pixi')

var colors = require('carch/browser/colors')
var classFactory = require('carch/core/class-factory')
var Hideout = require('carch/core/hideout')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}
    this.hideout = options.hideout || Hideout.create()
    this.stage = new PIXI.Stage(colors.darkBrown)
  }

  proto.update = function(){
    this.hideout.tick(Date.now())
  }
})
