var Hideout = require('carch/core/hideout')

var Game = require('carch/browser/game')

function randomInterval(start, end){
  var interval = end - start + 1
  return (start + interval * Math.random()) | 0
}

exports.stationary = function(){
  var hideout = Hideout.create({ width: 20, height: 10 })
  for(var i = 0; i < 10; i++){
    var minion = hideout.addMinion()
    var coord = [
      randomInterval(-hideout.dirWidth, +hideout.dirWidth),
      randomInterval(-hideout.dirHeight, +hideout.dirHeight),
    ]
    hideout.moveMinion(minion, coord)
  }
  return Game.create({ hideout: hideout })
}

exports.randomWalk = function(){
  var hideout = Hideout.create({ width: 20, height: 10 })
  var minion = hideout.addMinion()
  setInterval(function randomWalk(){
    var rand = Math.random()
    var oldCoord = hideout.coordOfMinion[minion]
    var newCoord = oldCoord.slice(0)
    if(rand < 0.25){
      newCoord[0]--
    } else if(rand < 0.5){
      newCoord[0]++
    } else if(rand < 0.75){
      newCoord[1]--
    } else {
      newCoord[1]++
    }
    if(hideout.containsCoord(newCoord)){
      hideout.moveMinion(minion, newCoord)
    } else {
      hideout.moveMinion(minion, hideout.origin)
    }
  }, 700)
  return Game.create({ hideout: hideout })
}
