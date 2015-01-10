var HideoutView = require('carch/browser/hideout-view')

exports.hideoutView = function(){
  var hideoutView = HideoutView.create()
  var hideout = hideoutView.hideout
  var minion = window.minion = hideout.addMinion()
  requestAnimationFrame(function loop(){
    var oldCoord = hideout.coordOfMinion[minion]
    var newCoord = [0, oldCoord[1]+0.25]
    hideout.moveMinion(minion, newCoord)
    requestAnimationFrame(loop)
  })
  return hideoutView
}
