var expect = require('carch/test/support/chai').expect

var sinon = require('sinon')

var Hideout = require('carch/core/hideout')
var Minion = require('carch/core/minion')

describe('Hideout', function(){
  beforeEach(function(){
    this.hideout = Hideout.create()
    this.spy = sinon.spy()
  })

  describe('#addMinion', function(){
    it('returns a minion', function(){
      var minion = this.hideout.addMinion()
      expect(minion).to.be.instanceof(Minion)
    })

    it('starts at origin', function(){
      var minion = this.hideout.addMinion()
      expect(this.hideout.coordOfMinion[minion]).to.equal(this.hideout.origin)
    })

    it('emits "addMinion" event', function(){
      this.hideout.on('addMinion', this.spy)
      var minion = this.hideout.addMinion()
      expect(this.spy).to.have.been.calledWith(this.hideout, minion, this.hideout.origin)
    })
  })

  describe('#moveMinion', function(){
    beforeEach(function(){
      this.minion = this.hideout.addMinion()
      this.startCoord = this.hideout.coordOfMinion[this.minion]
    })

    it('moves the minion', function(){
      var newCoord = [10, 10]
      this.hideout.moveMinion(this.minion, newCoord)
      expect(this.hideout.coordOfMinion[this.minion]).to.equal(newCoord)
    })

    it('emits "move" event on minion', function(){
      var newCoord = [10, 10]
      this.minion.on('move', this.spy)
      this.hideout.moveMinion(this.minion, newCoord)
      expect(this.spy).to.have.been.calledWith(this.minion, this.startCoord, newCoord)
    })
  })
})
