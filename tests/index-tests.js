// Test dependencies
var chai = require('chai');
var sinon = require('sinon');
var proxyquire =  require('proxyquire');

var expect = chai.expect;
var assert = chai.assert;

var unlessSpy = sinon.spy();

var expressJwtInstance = {
  unless: unlessSpy
};

var expressJwtProxy = function() {
  return expressJwtInstance;
};

// System Under Test
var fixture = proxyquire('../index', { 'express-jwt': expressJwtProxy });


describe('boast-server-jwt', function() {
  describe('enforceJwtPolicy', function() {
    var expressAppStub;
    var expressJwtStub;

    var expressAppFake = {
      use: function() {}
    };

    var handleError = function(error) {
      console.log('HANDLE ERROR:');
      console.log(error);

      throw error;
    };

    before(function() {
      expressAppStub = sinon.stub(expressAppFake, 'use', function() {});
    });

    it('should be defined', function() {
      assert.isDefined(fixture);
    });

    it('should allow excludeRoutes to be optional', function(done) {
      var excludeRoutes = undefined;

      fixture.enforceJwtPolicy(expressAppFake, excludeRoutes)
        .then(function(app) {
          //console.log(app);
          sinon.assert.callCount(expressAppStub, 1);
          sinon.assert.callCount(unlessSpy, 0);
        
          done();
        })
        .catch(handleError);
    });

    it('should call .unless() when excludeRoutes are provided', function(done) {
      var excludeRoutes = {
        path: [
            { url: '/api/admins/login', methods: ['POST']  },
            { url: '/api/users', methods: ['POST']  },
            { url: '/', methods: ['GET']  },
        ]
      };

      fixture.enforceJwtPolicy(expressAppFake, excludeRoutes)
        .then(function(app) {
          assert.isDefined(app);
          sinon.assert.callCount(unlessSpy, 1);

          done();
        })
        .catch(handleError);
    });

    it('requires express app as first argument', function() {
      var excludeRoutes = undefined;
      var expressAppFake = undefined;

      expect(fixture.enforceJwtPolicy.bind(fixture, expressAppFake, excludeRoutes)).to.throw();
    });

  });
});
