var expect = require('chai').expect

var time = require('carch/util/time')

var MinionResources = require('carch/core/minion-resources')

describe('MinionResources', function(){
  beforeEach(function(){
    this.minionResources = MinionResources.create()
  })

  describe('#tickTo', function(){
    beforeEach(function(){
      this.now = this.minionResources.lastTick
    })

    it('ignores if targetTime is < lastTime', function(){
      this.minionResources.tickTo(this.now - 1)
      expect(this.minionResources.lastTick).to.equal(this.now)
    })

    it('sets lastTick', function(){
      var newTime = this.now + 92085
      this.minionResources.tickTo(newTime)
      expect(this.minionResources.lastTick).to.equal(newTime)
    })

    describe('energy', function(){
      it('starts at 100', function(){
        expect(this.minionResources.energy).to.equal(100)
      })

      it('removes all energy every hour', function(){
        this.minionResources.tickTo(this.now + time.hour(1))
        expect(this.minionResources.energy).to.equal(0)
      })

      it('removes half energy every 30 minutes', function(){
        var next = this.now + time.min(30)
        this.minionResources.tickTo(next)
        expect(this.minionResources.energy).to.equal(50)

        next += time.min(30)
        this.minionResources.tickTo(next)
        expect(this.minionResources.energy).to.equal(0)
      })
    })

    describe('food', function(){
      it('starts at 100', function(){
        expect(this.minionResources.food).to.equal(100)
      })

      it('removes all food every 15 minutes', function(){
        this.minionResources.tickTo(this.now + time.min(15))
        expect(this.minionResources.food).to.equal(0)
      })

      it('removes half food every 7.5 minutes', function(){
        var next = this.now + time.min(7.5)
        this.minionResources.tickTo(next)
        expect(this.minionResources.food).to.equal(50)

        next += time.min(7.5)
        this.minionResources.tickTo(next)
        expect(this.minionResources.food).to.equal(0)
      })
    })
  })
})
