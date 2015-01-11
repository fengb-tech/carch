var _ = require('lodash')

var classFactory = require('carch/util/class-factory')

var MinionView = require('carch/browser/minion-view')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.hideout = options.hideout
    this.pixiContainer = options.pixiContainer

    this.hideout.on('addMinion', _.bind(this.onAddMinion, this))
  }

  proto.tickTo = _.noop

  proto.onAddMinion = function(hideout, minion, coord){
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
