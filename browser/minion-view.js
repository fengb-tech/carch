var PIXI = require('pixi')
var _ = require('lodash')

var classFactory = require('carch/core/class-factory')
var Minion = require('carch/core/minion')

var texture = _.once(function(){
  return PIXI.Texture.fromImage('/minion.png')
})

module.exports = classFactory(function MinionView(proto){
  proto.init = function(options){
    options = options || {}
    this.minion = options.minion
    this.sprite = new PIXI.Sprite(texture())
    this.sprite.x = options.coord[0]
    this.sprite.y = options.coord[1]
  }

  proto.update = function(){
    this.hideout.tick(Date.now())
  }
})
