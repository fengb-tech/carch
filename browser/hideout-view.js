var _ = require('lodash')
var PIXI = require('pixi')

var classFactory = require('carch/util/class-factory')

var MinionView = require('carch/browser/minion-view')
var colors = require('carch/browser/colors')

var Hideout = require('carch/core/hideout')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}
    this.subviews = []
    this.hideout = options.hideout || Hideout.create()
    this.stage = new PIXI.Stage(colors.darkBrown)

    this.hideout.on('addMinion', _.bind(this.onAddMinion, this))
  }

  proto.tickTo = function(targetTime){
    for(var i=0; i < this.subviews.length; i++){
      this.subviews[i].tickTo(targetTime)
    }
  }

  proto.onAddMinion = function(hideout, minion, coord){
    var minionView = MinionView.create({
      displayCoord: _.bind(this.displayCoord, this),
      minion: minion,
      coord: coord,
    })
    this.stage.addChild(minionView.sprite)
    this.subviews.push(minionView)
  }

  proto.displayCoord = function(coord){
    return [(coord[0] + this.hideout.dirWidth) * 64,
            (coord[1] + this.hideout.dirHeight) * 64]
  }
})
