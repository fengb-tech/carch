var HideoutView = require('carch/browser/hideout-view')

exports.hideoutView = function(){
  var hideoutView = HideoutView.create()
  var hideout = hideoutView.hideout
  var minion = hideout.addMinion()
  setInterval(function loop(){
    var oldCoord = hideout.coordOfMinion[minion]
    var newCoord = [0, oldCoord[1]+1]
    hideout.moveMinion(minion, newCoord)
  }, 1000)
  return hideoutView
}
