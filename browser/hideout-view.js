var _ = require('lodash')
var PIXI = require('pixi.js')

var classFactory = require('carch/util/class-factory')

var MinionView = require('carch/browser/minion-view')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.hideout = options.hideout
    this.pixiContainer = this.initContainer()
    options.pixiContainer.addChild(this.pixiContainer)

    var self = this
    this.hideout.on('addMinion', function(hideout, minion, coord){
      self.addMinionView(minion, coord)
    })
    for(var i = 0; i < this.hideout.minions.length; i++){
      var minion = this.hideout.minions[i]
      self.addMinionView(minion, this.hideout.coordOfMinion[minion])
    }
  }

  proto.initContainer = function(){
    var texture = PIXI.Texture.fromImage('tile.png')
    var drawWidth = this.hideout.width * 64
    var drawHeight = this.hideout.height * 64
    var container = new PIXI.TilingSprite(texture, drawWidth, drawHeight)
    container.interactive = true
    // Bug - need to manually set hitArea of TilingSprite:
    //   https://github.com/GoodBoyDigital/pixi.js/issues/1132
    container.hitArea = new PIXI.Rectangle(0, 0, drawWidth, drawHeight)

    var referencePoint
    function moving(moveData){
      container.position.x = moveData.global.x - referencePoint.x
      container.position.y = moveData.global.y - referencePoint.y
    }

    container.mousedown = container.touchstart = function(startData){
      referencePoint = startData.global.clone()
      referencePoint.x -= container.position.x
      referencePoint.y -= container.position.y
      container.mousemove = container.touchmove = moving
    }

    container.mouseup = container.touchend = container.mouseupoutside = container.touchendoutside = function(stopData){
      delete container.mousemove
      delete container.touchmove
    }

    return container
  }

  proto.addMinionView = function(minion, coord){
    var minionView = MinionView.create({
      displayCoord: _.bind(this.displayCoord, this),
      tickManager: this.tickManager,
      minion: minion,
      coord: coord,
    })
    this.pixiContainer.addChild(minionView.sprite)
  }

  proto.displayCoord = function(coord){
    return [(coord[0] + this.hideout.dirWidth) * 64,
            (coord[1] + this.hideout.dirHeight) * 64]
  }
})
