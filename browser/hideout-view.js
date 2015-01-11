var _ = require('lodash')
var PIXI = require('pixi')

var classFactory = require('carch/util/class-factory')

var MinionView = require('carch/browser/minion-view')
var colors = require('carch/browser/colors')

var Hideout = require('carch/core/hideout')
var TickManager = require('carch/core/tick-manager')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}
    this.tickManager = options.tickManager || TickManager.create()
    this.hideout = options.hideout || Hideout.create()
    this.stage = new PIXI.Stage(colors.darkBrown)

    this.hideout.on('addMinion', _.bind(this.onAddMinion, this))
  }

  proto.tickTo = function(targetTime){
    this.tickManager.tickTo(targetTime)
  }

  proto.onAddMinion = function(hideout, minion, coord){
    var minionView = MinionView.create({
      displayCoord: _.bind(this.displayCoord, this),
      tickManager: this.tickManager,
      minion: minion,
      coord: coord,
    })
    this.stage.addChild(minionView.sprite)
  }

  proto.displayCoord = function(coord){
    return [(coord[0] + this.hideout.dirWidth) * 64,
            (coord[1] + this.hideout.dirHeight) * 64]
  }
})
