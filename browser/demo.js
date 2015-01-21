var _ = require('lodash')

var Coord = require('carch/core/coord')
var Hideout = require('carch/core/hideout')
var ResourceStation = require('carch/core/resource-station')

var Game = require('carch/browser/game')

function randomInterval(start, end){
  var interval = end - start + 1
  return (start + interval * Math.random()) | 0
}

function createHideout(numMinions){
  var hideout = Hideout.create({ width: 15, height: 10 })
  for(var i = 0; i < numMinions; i++){
    var minion = hideout.addMinion()
    var coord = Coord.create({
      x: randomInterval(-hideout.dirWidth, +hideout.dirWidth),
      y: randomInterval(-hideout.dirHeight, +hideout.dirHeight),
    })
    hideout.moveActor(minion, coord)
  }
  return hideout
}

exports.createGame = function(numMinions){
  var hideout = createHideout(numMinions)
  return Game.create({ hideout: hideout })
}

exports.aiRandomWalk = function(game){
  setInterval(function(){
    game.hideout.minions.forEach(function(minion){
      var rand = Math.random()
      var oldCoord = game.hideout.coordOf(minion)
      var newCoord = Coord.create({ x: oldCoord.x, y: oldCoord.y })
      if(rand < 0.25){
        newCoord.x--
      } else if(rand < 0.5){
        newCoord.x++
      } else if(rand < 0.75){
        newCoord.y--
      } else {
        newCoord.y++
      }
      if(game.hideout.containsCoord(newCoord)){
        game.hideout.moveActor(minion, newCoord)
      } else {
        game.hideout.moveActor(minion, game.hideout.origin)
      }
    })
  }, 700)
}

exports.musicalChairsGame = function(){
  var hideout = createHideout(1)
  var minion = hideout.minions[0]
  var food = ResourceStation.create({ type: 'food' })
  hideout.addResourceStation(food, Coord.create({ x: 4, y: -3 }))
  var energy = ResourceStation.create({ type: 'energy' })
  hideout.addResourceStation(energy, Coord.create({ x: -4, y: -3 }))

  var types = ['food', 'energy']
  var i = 0
  setInterval(function(){
    var minionCoord = hideout.coordOf(minion)
    var targetCoord = hideout.nearestResourceStationCoordTo(types[i % types.length], minionCoord)
    hideout.moveActor(minion, targetCoord)
    i++
  }, 1000)
  return Game.create({ hideout: hideout })
}
