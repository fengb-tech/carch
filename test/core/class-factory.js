var appRoot = require('app-root-path')
var expect = require('chai').expect

var classFactory = require(appRoot + '/core/class-factory')

describe('classFactory', function(){
  describe('naming', function(){
    beforeEach(function(){
      this.Class = classFactory('Foo', function(){})
    })

    it('returns correct #name', function(){
      expect(this.Class.name).to.equal('Foo')
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

      expect(new Class().foo).to.equal('bar')
    })

    it('passes the class as "this"', function(){
      var Class = classFactory('Foo', function(proto){
        this.foo = 'bar'
      })

      expect(Class.foo).to.equal('bar')
    })
  })
})
