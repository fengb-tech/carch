var Hideout = require('carch/core/hideout')
var HideoutView = require('carch/browser/hideout-view')

exports.hideoutView = function(){
  var hideout = Hideout.create({ width: 20, height: 10 })
  var hideoutView = HideoutView.create({ hideout: hideout })
  var minion = hideout.addMinion()
  function randomWalk(){
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
  }
  setInterval(randomWalk, 700)
  return hideoutView
}
