var _ = require('lodash')
var PIXI = require('pixi.js')

var classFactory = require('carch/util/class-factory')

var ActorView = require('carch/browser/actor-view')
var Coord = require('carch/core/coord')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.hideout = options.hideout
    this.pixiContainer = this.initContainer()
    options.pixiContainer.addChild(this.pixiContainer)

    var self = this
    this.hideout.on('addMinion', function(hideout, minion, coord){
      self.addActorView(minion, coord)
    })
    this.hideout.actors(function(actor){
      self.addActorView(actor, self.hideout.coordOf(actor))
    })
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

  proto.addActorView = function(actor, coord){
    var actorView = ActorView.create({
      displayCoord: _.bind(this.displayCoord, this),
      tickManager: this.tickManager,
      actor: actor,
      coord: coord,
    })
    this.pixiContainer.addChild(actorView.sprite)
    actorView.on('select', _.bind(this.select, this))
    actorView.on('deselect', _.bind(this.deselect, this))
  }

  proto.select = function(actorView){
    if(this.selectedActorView === actorView){
      // Don't bother selecting selected view
      return
    }

    if(this.selectedActorView){
      this.selectedActorView.deselect()
    }
    this.selectedActorView = actorView
  }

  proto.deselect = function(actorView){
    if(this.selectedActorView === actorView){
      this.selectedActorView = null
    }
  }

  proto.displayCoord = function(coord, targetCoord){
    targetCoord = targetCoord || Coord.create()
    targetCoord.x = (coord.x + this.hideout.dirWidth) * 64
    targetCoord.y = (coord.y + this.hideout.dirHeight) * 64
    return targetCoord
  }
})
