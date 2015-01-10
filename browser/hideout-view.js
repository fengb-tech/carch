var PIXI = require('pixi')
var _ = require('lodash')

var MinionView = require('carch/browser/minion-view')
var colors = require('carch/browser/colors')

var classFactory = require('carch/core/class-factory')
var Hideout = require('carch/core/hideout')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}
    this.subviews = []
    this.hideout = options.hideout || Hideout.create()
    this.stage = new PIXI.Stage(colors.darkBrown)

    this.hideout.on('addMinion', _.bind(this.onAddMinion, this))
  }

  proto.update = function(){
    this.hideout.tick(Date.now())
  }

  proto.onAddMinion = function(minion, coord){
    var minionView = MinionView.create({
      minion: minion,
      coord: coord,
    })
    this.stage.addChild(minionView.sprite)
    this.subviews.push(minionView)
  }
})
