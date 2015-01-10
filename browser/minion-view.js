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
    this.sprite.position.x = options.coord[0]
    this.sprite.position.y = options.coord[1]

    this.minion.on('move', _.bind(this.onMove, this))
  }

  proto.update = function(){
    this.hideout.tick(Date.now())
  }

  proto.onMove = function(minion, fromCoord, toCoord){
    this.sprite.position.x = toCoord[0]
    this.sprite.position.y = toCoord[1]
  }
})
