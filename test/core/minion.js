var appRoot = require('app-root-path')
var expect = require('chai').expect

var Minion = require(appRoot + '/core/minion')
var time = require(appRoot + '/core/time')

describe('Minion', function(){
  beforeEach(function(){
    this.minion = new Minion()
  })

  it('starts with 100 energy', function(){
    expect(this.minion.energy).to.equal(100)
  })

  describe('#tickTo', function(){
    beforeEach(function(){
      this.now = this.minion.lastTick
    })

    it('ignores if targetTime is < lastTime', function(){
      this.minion.tickTo(this.now - 1)
      expect(this.minion.lastTick).to.equal(this.now)
    })

    it('sets lastTick', function(){
      var newTime = this.now + 92085
      this.minion.tickTo(newTime)
      expect(this.minion.lastTick).to.equal(newTime)
    })

    describe('energy', function(){
      it('starts at 100', function(){
        expect(this.minion.energy).to.equal(100)
      })

      it('removes all energy every hour', function(){
        this.minion.tickTo(this.now + time.hour(1))
        expect(this.minion.energy).to.equal(0)
      })

      it('removes half energy every 30 minutes', function(){
        var next = this.now + time.min(30)
        this.minion.tickTo(next)
        expect(this.minion.energy).to.equal(50)

        next += time.min(30)
        this.minion.tickTo(next)
        expect(this.minion.energy).to.equal(0)
      })
    })

    describe('satiety', function(){
      it('starts at 100', function(){
        expect(this.minion.satiety).to.equal(100)
      })

      it('removes all satiety every 15 minutes', function(){
        this.minion.tickTo(this.now + time.min(15))
        expect(this.minion.satiety).to.equal(0)
      })

      it('removes half satiety every 7.5 minutes', function(){
        var next = this.now + time.min(7.5)
        this.minion.tickTo(next)
        expect(this.minion.satiety).to.equal(50)

        next += time.min(7.5)
        this.minion.tickTo(next)
        expect(this.minion.satiety).to.equal(0)
      })
    })
  })
})
