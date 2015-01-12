var _ = require('lodash')

var classFactory = require('carch/util/class-factory')

var MinionView = require('carch/browser/minion-view')

module.exports = classFactory(function HideoutView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.hideout = options.hideout
    this.pixiContainer = options.pixiContainer

    var self = this
    this.hideout.on('addMinion', function(hideout, minion, coord){
      self.addMinionView(minion, coord)
    })
    for(var i=0; i < this.hideout.minions.length; i++){
      var minion = this.hideout.minions[i]
      self.addMinionView(minion, this.hideout.coordOfMinion[minion])
    }
  }

  proto.tickTo = _.noop

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
