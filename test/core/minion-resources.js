var expect = require('chai').expect
var sinon = require('sinon')

var time = require('carch/util/time')

var MinionResources = require('carch/core/minion-resources')
var EventManager = require('carch/core/event-manager')

describe('MinionResources', function(){
  beforeEach(function(){
    this.eventManager = EventManager.create()
    this.minionResources = MinionResources.create({ eventManager: this.eventManager })
    this.now = this.minionResources.lastTick
  })

  describe('#tickTo', function(){
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

  describe('queueNextAction', function(){
    beforeEach(function(){
      this.addEvent = sinon.spy(this.eventManager, 'addEvent')
    })

    it('triggers in 11.25 minutes (25% of food)', function(){
      this.minionResources.queueNextAction()
      expect(this.addEvent).to.have.been.calledWith(this.now + time.min(11.25))
    })

    it('triggers in 0.6 minutes (1% of energy) when at 26% energy', function(){
      this.minionResources.energy = 26
      this.minionResources.queueNextAction()
      expect(this.addEvent).to.have.been.calledWith(this.now + time.min(0.6))
    })

    it('emits a "next" event', function(){
      this.minionResources.queueNextAction()
      var callback = this.addEvent.getCall(0).args[1]
      expect(callback).to.not.be.undefined()

      var eventSpy = sinon.spy()
      this.minionResources.on('next', eventSpy)
      callback()
      expect(eventSpy).to.have.callCount(1)
    })
  })
})
