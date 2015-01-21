var expect = require('chai').expect

var classFactory = require('carch/util/class-factory')

describe('classFactory', function(){
  beforeEach(function(){
    this.Class = classFactory('Foo', function(){})
  })

  describe('naming', function(){
    it('returns correct #cfName', function(){
      expect(this.Class.cfName).to.equal('Foo')
    })

    describe('instance#toString', function(){
      it('matches <{name}-*>', function(){
        var instance = this.Class.create()
        expect(instance.toString()).to.match(/<Foo-.+>/)
      })

      it('is different for each instance', function(){
        var instance1 = this.Class.create()
        var instance2 = this.Class.create()
        expect(instance1.toString()).to.not.equal(instance2.toString())
      })
    })
  })

  describe('callback', function(){
    it('passes prototype as argument', function(){
      var Class = classFactory('Foo', function(proto){
        proto.foo = 'bar'
      })

      expect(Class.create().foo).to.equal('bar')
    })

    it('passes the class as "this"', function(){
      var Class = classFactory('Foo', function(proto){
        this.foo = 'bar'
      })

      expect(Class.foo).to.equal('bar')
    })
  })

  describe('.inherits()', function(){
    beforeEach(function(){
      this.Super = function(){
        this.superInitted = true
      }
      this.Super.prototype = { superProtod: true }
      this.Class.inherits(this.Super)
    })

    it('adds Super.prototype methods', function(){
      var instance = this.Class.create()
      expect(instance.superProtod).to.equal(true)
    })

    it('invokes Super()', function(){
      var instance = this.Class.create()
      expect(instance.superInitted).to.equal(true)
    })
  })

  describe('.destroy()', function(){
    it('drops the instance onto .cfPool', function(){
      var instance = this.Class.create()
      instance.destroy()
      expect(this.Class.cfPool.length).to.equal(1)
      expect(this.Class.cfPool[0]).to.equal(instance)
    })

    it('deletes all keys except cfId', function(){
      var instance = this.Class.create()
      instance.prop = 1
      instance.prop2 = ''
      instance.destroy()
      expect(Object.keys(instance)).to.eql(['cfId'])
    })

    it('allows .create() directly from .cfPool', function(){
      var instance = this.Class.create()
      instance.destroy()
      var instance2 = this.Class.create()
      expect(instance2).to.equal(instance)
    })
  })
})
