// native
const assert = require('assert');

// third-party
const should = require('should');

// own
const PermissionList = require('../../lib/permission-list');

describe('new PermissionList(options)', function () {

  it('should instantiate a permission list with the given options', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1'],
      public: false,
    });

    list.can('subject-1').should.eql(false);
    list.can('subject-2').should.eql(true);
  });

  it('should require `authorized` to be either [String] or undefined', function () {
    assert.throws(function () {
      var list = new PermissionList({
        authorized: 'subject-1',
      });
    });
    assert.throws(function () {
      var list = new PermissionList({
        authorized: {}
      });
    });
    assert.throws(function () {
      var list = new PermissionList({
        authorized: [undefined],
      });
    });
  });

  it('should require `blocked` to be either [String] or undefined', function () {
    assert.throws(function () {
      var list = new PermissionList({
        blocked: 'subject-1',
      });
    });
    assert.throws(function () {
      var list = new PermissionList({
        blocked: {}
      });
    });
    assert.throws(function () {
      var list = new PermissionList({
        blocked: [undefined],
      });
    });
  });

  it('should require `public` option to be Boolean or undefined', function () {
    assert.throws(function () {
      var list = new PermissionList({
        public: {}
      });
    });

    assert.throws(function () {
      var list = new PermissionList({
        public: 'str'
      });
    });
  });

});

describe('PermissionList#authorize(subject)', function () {

  it('should add the subject to the array of authorized subjects', function () {
    var list = new PermissionList();

    list.authorize('subject-1');

    list.can('subject-2').should.eql(false);
    list.can('subject-1').should.eql(true);
  });

  it('should require subject not to be undefined', function () {
    var list = new PermissionList();

    assert.throws(function () {
      list.authorize(undefined);
    });
  });

  it('should be idempotent', function () {
    var list = new PermissionList();

    list.authorize('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1'],
      blocked: [],
      public: false,
    });

    list.authorize('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1'],
      blocked: [],
      public: false,
    });
  });

});

describe('PermissionList#unauthorize(subject)', function () {

  it('should remove the subject from the array of authorized subjects', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
    });

    list.unauthorize('subject-1');

    list.can('subject-2').should.eql(true);
    list.can('subject-1').should.eql(false);
  });

  it('should require subject to be a String', function () {
    var list = new PermissionList();

    assert.throws(function () {
      list.unauthorize(undefined);
    });
  });

  it('should be idempotent', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
    });

    list.unauthorize('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-2'],
      blocked: [],
      public: false,
    });

    list.unauthorize('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-2'],
      blocked: [],
      public: false,
    });

  });
});

describe('PermissionList#isAuthorized(subject)', function () {
  it('should return true if the given subject is in th authorized list', function () {
    var list = new PermissionList({
      authorized: ['subject-1'],
    });

    list.isAuthorized('subject-1').should.eql(true);
    list.isAuthorized('subject-2').should.eql(false);
  });

  it('should require a subject', function () {
    var list = new PermissionList({
      authorized: ['subject-1'],
    });

    assert.throws(function () {
      list.isAuthorized();
    });
  });
});

describe('PermissionList#block(subject)', function () {

  it('should add the subject to the array of blocked subjects', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
    });

    list.block('subject-1');

    list.can('subject-2').should.eql(true);
    list.can('subject-1').should.eql(false);
  });

  it('should require subject to be a String', function () {
    var list = new PermissionList();

    assert.throws(function () {
      list.block(undefined);
    });
  });

  it('should be idempotent', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
    });

    list.block('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1'],
      public: false,
    });

    list.block('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1'],
      public: false,
    });
  });
});

describe('PermissionList#unblock(subject)', function () {

  it('should remove the subject to the array of blocked subjects', function () {
    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1', 'subject-2'],
    });

    list.unblock('subject-1');

    list.can('subject-2').should.eql(false);
    list.can('subject-1').should.eql(true);
  });

  it('should require subject to be a String', function () {
    var list = new PermissionList();

    assert.throws(function () {
      list.unblock(undefined);
    });
  });

  it('should be idempotent', function () {

    var list = new PermissionList({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1', 'subject-2'],
    });

    list.unblock('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-2'],
      public: false,
    });

    list.unblock('subject-1');

    list.toJSON().should.eql({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-2'],
      public: false,
    });
  });
});

describe('PermissionList#isBlocked(subject)', function () {
  it('should return true if the given subject is in th blocked list', function () {
    var list = new PermissionList({
      blocked: ['subject-1'],
    });

    list.isBlocked('subject-1').should.eql(true);
    list.isBlocked('subject-2').should.eql(false);
  });

  it('should require a subject', function () {
    var list = new PermissionList({
      blocked: ['subject-1'],
    });

    assert.throws(function () {
      list.isBlocked();
    });
  });
});

describe('PermissionList#makePublic()', function () {
  it('should set the `public` property to true', function () {
    var list = new PermissionList();

    list.public.should.eql(false);

    list.makePublic();
    list.public.should.eql(true);
  });
});

describe('PermissionList#makePrivate()', function () {
  it('should set the `public` property to true', function () {
    var list = new PermissionList({
      public: true,
    });

    list.public.should.eql(true);

    list.makePrivate();
    list.public.should.eql(false);
  });
});

describe('PermissionList#can(subject)', function () {

  it('should require a subject', function () {
    var list = new PermissionList();

    assert.throws(function () {
      list.can();
    });
  });

  describe('private (public: false)', function () {
    it('should check if subject has been authorized', function () {
      var list = new PermissionList({
        authorized: ['subject-1', 'subject-2'],
        // public: false,
      });

      list.can('subject-1').should.eql(true);
      list.can('subject-2').should.eql(true);
      list.can('subject-3').should.eql(false);
    });

    it('should check if subject has been blocked', function () {
      var list = new PermissionList({
        authorized: ['subject-1', 'subject-2'],
        blocked: ['subject-2'],
      });

      list.can('subject-1').should.eql(true);
      list.can('subject-2').should.eql(false); // blocked
      list.can('subject-3').should.eql(false); // not authorized
    });
  });

  describe('public (public: true)', function () {
    it('it only checks whether the subject has been blocked', function () {
      var list = new PermissionList({
        authorized: ['subject-1', 'subject-2'],
        blocked: ['subject-2'],
        public: true,
      });

      list.can('subject-1').should.eql(true);
      list.can('subject-2').should.eql(false); // has been blocked
      list.can('subject-3').should.eql(true);  // not explicitly authorized, but permission is public
    });
  });
});

describe('PermissionList#toJSON()', function () {
  it('should return an object correctly formatted', function () {
    var list = new PermissionList({
      public: true
    });

    list.authorize('subject-1');
    list.authorize('subject-2');

    list.block('subject-1');

    list.toJSON().should.eql({
      public: true,
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1'],
    });

  });
});
