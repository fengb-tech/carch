var expect = require('carch/test/support/chai').expect

var sinon = require('sinon')

var Coord = require('carch/core/coord')
var Hideout = require('carch/core/hideout')
var Minion = require('carch/core/minion')

describe('Hideout', function(){
  beforeEach(function(){
    this.hideout = Hideout.create({ width: 10, height: 10 })
    this.spy = sinon.spy()
  })

  describe('#addMinion', function(){
    it('returns a minion', function(){
      var minion = this.hideout.addMinion()
      expect(minion).to.be.instanceof(Minion)
    })

    it('starts at origin', function(){
      var minion = this.hideout.addMinion()
      expect(this.hideout.coordOf(minion)).to.equal(this.hideout.origin)
    })

    it('emits "addMinion" event', function(){
      this.hideout.on('addMinion', this.spy)
      var minion = this.hideout.addMinion()
      expect(this.spy).to.have.been.calledWith(this.hideout, minion, this.hideout.origin)
    })
  })

  describe('#moveActor', function(){
    beforeEach(function(){
      this.minion = this.hideout.addMinion()
      this.startCoord = this.hideout.coordOf(this.minion)
    })

    it('moves the minion', function(){
      var newCoord = Coord.create({ x: 1, y: 2 })
      this.hideout.moveActor(this.minion, newCoord)
      expect(this.hideout.coordOf(this.minion)).to.equal(newCoord)
    })

    it('emits "move" event on minion', function(){
      var newCoord = [3, 2]
      this.minion.on('move', this.spy)
      this.hideout.moveActor(this.minion, newCoord)
      expect(this.spy).to.have.been.calledWith(this.minion, this.startCoord, newCoord)
    })
  })
})
