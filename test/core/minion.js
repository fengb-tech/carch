var expect = require('chai').expect

var Minion = require('cate/core/minion')

describe('Minion', function(){
  beforeEach(function(){
    this.minion = new Minion()
  })

  it('starts with 100 energy', function(){
    expect(this.minion.energy).to.equal(100)
  })

  describe('#tick', function(){
    beforeEach(function(){
      this.now = this.minion.lastTick
    })

    it('sets lastTick', function(){
      var newTime = this.now + 92085
      this.minion.tick(newTime)
      expect(this.minion.lastTick).to.equal(newTime)
    })

    it('removes all energy within an hour', function(){
      this.minion.tick(this.now + 1000)
      expect(this.minion.energy).to.equal(0)
    })
  })
})
