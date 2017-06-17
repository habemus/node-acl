// native
const assert = require('assert');

// third-party
const should = require('should');

const PermissionList = require('../../lib/permission-list');
const ACL = require('../../lib');

describe('new ACL(permissionLists)', function () {
  it('should instantiate a new ACL object with the given permission lists', function () {

    var acl = new ACL({
      read: new PermissionList({
        authorized: ['subject-1'],
      }),
      write: new PermissionList({
        authorized: ['subject-1'],
      }),
    });

    acl.can('subject-1', ['read', 'write']).should.eql(true);
  });

  it('should convert plain objects into permission lists', function () {

    var acl = new ACL({
      read: {
        authorized: ['subject-1'],
      },
      write: new PermissionList({
        authorized: ['subject-1'],
      }),
    });

    acl.can('subject-1', ['read', 'write']).should.eql(true);
  });
});

describe('ACL#authorize(subject, permissions)', function () {

  it('should authorize a subject to permissions', function () {
    var acl = new ACL({
      read: {},
      write: {},
      delete: {},
    });

    // string signature
    acl.authorize('subject-1', 'read');

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-1', 'delete').should.eql(false);

    // array signature
    acl.authorize('subject-1', ['write', 'delete']);

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(true);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.authorize();
    });

    assert.throws(function () {
      acl.authorize([undefined]);
    });
  });

  it('should require the permission to exist', function () {
    var acl = new ACL({
      read: {},
      write: {},
      delete: {},
    });

    assert.throws(function () {
      acl.authorize('subject-1', 'non-existent-permission');
    });
  });
});

describe('ACL#unauthorize(subject, permissions)', function () {
  it('should unauthorize a subject to permissions', function () {
    var acl = new ACL({
      read: {},
      write: {},
      delete: {},
    });

    acl.authorize('subject-1', ['read', 'write', 'delete']);

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(true);

    // array signature
    acl.unauthorize('subject-1', ['read', 'delete']);

    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(false);

    // string signature
    acl.unauthorize('subject-1', 'write');

    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-1', 'delete').should.eql(false);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.unauthorize();
    });

    assert.throws(function () {
      acl.unauthorize([undefined]);
    });
  });
});

describe('ACL#block(subject, permissions)', function () {
  it('should block a subject to permissions', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1', 'subject-2'],
      },
      write: {
        authorized: ['subject-1', 'subject-2'],
      }
    });

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-2', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-2', 'write').should.eql(true);

    // array signature
    acl.block('subject-1', ['read', 'write']);

    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-2', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-2', 'write').should.eql(true);

    // string signature
    acl.block('subject-2', 'read');

    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-2', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-2', 'write').should.eql(true);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.block();
    });

    assert.throws(function () {
      acl.block([undefined]);
    });
  });
});

describe('ACL#unblock(subject, permissions)', function () {
  it('should block a subject to multiple permissions', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1', 'subject-2'],
        blocked: ['subject-1', 'subject-2'],
      },
      write: {
        authorized: ['subject-1', 'subject-2'],
        blocked: ['subject-1', 'subject-2'],
      }
    });

    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-2', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-2', 'write').should.eql(false);

    // array signature
    acl.unblock('subject-1', ['read', 'write']);

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-2', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-2', 'write').should.eql(false);

    // string signature
    acl.unblock('subject-2', 'read');

    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-2', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-2', 'write').should.eql(false);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.unblock();
    });

    assert.throws(function () {
      acl.unblock([undefined]);
    });
  });
});

describe('ACL#makePublic(permissions)', function () {
  it('should make the permissions public', function () {
    var acl = new ACL({
      read: {},
      write: {},
      delete: {},
    });

    // by default permissions are private
    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-1', 'delete').should.eql(false);

    acl.makePublic('read');

    // public permission allows any subject to read unless
    // it is explicitly blocked
    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-1', 'delete').should.eql(false);

    acl.makePublic(['write', 'delete']);
    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(true);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.makePublic();
    });

    assert.throws(function () {
      acl.makePublic([undefined]);
    });
  });
});

describe('ACL#makePrivate(permissions)', function () {

  it('should make the permissions private', function () {
    var acl = new ACL({
      read: {
        public: true,
      },
      write: {
        public: true,
      },
      delete: {
        public: true,
      },
    });

    // permissions started public
    acl.can('subject-1', 'read').should.eql(true);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(true);

    acl.makePrivate('read');

    // private permission disallows all subjects
    // unless explicitly authorized AND not blocked
    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', 'delete').should.eql(true);

    acl.makePrivate(['write', 'delete']);
    acl.can('subject-1', 'read').should.eql(false);
    acl.can('subject-1', 'write').should.eql(false);
    acl.can('subject-1', 'delete').should.eql(false);
  });

  it('should require permissions to be either String or [String]', function () {
    var acl = new ACL();

    assert.throws(function () {
      acl.makePrivate();
    });

    assert.throws(function () {
      acl.makePrivate([undefined]);
    });
  });
});

describe('ACL#can(subject, permissions)', function () {
  it('should return true only if subject is allowed all permissions', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1', 'subject-2'],
      },
      write: {
        authorized: ['subject-1', 'subject-2'],
      },
      delete: {
        blocked: ['subject-1'],
        public: true,
      },
    });

    acl.can('subject-1', 'write').should.eql(true);
    acl.can('subject-1', ['read', 'write']).should.eql(true);
    acl.can('subject-1', ['read', 'write', 'delete']).should.eql(false); // sub-1 is blocked for delete
    acl.can('subject-1', 'non-existent-permission').should.eql(false);
    
    acl.can('subject-2', ['read', 'write', 'delete']).should.eql(true);
  });

  it('should require permissions to be either String or [String] (non-empty)', function () {
    var acl = new ACL({
      read: {},
    });

    assert.throws(function () {
      acl.can('subject-1');
    });

    assert.throws(function () {
      acl.can('subject-1', [undefined]);
    });

    assert.throws(function () {
      acl.can('subject-1', []);
    });
  });
});

describe('ACL#ensurePermissionList(permission)', function () {
  it('should create a permission list if it does not exist', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1'],
      },
    });

    acl.ensurePermissionList('write');

    acl.authorize('subject-1', 'write');
    acl.can('subject-1', 'write').should.eql(true);

    acl.toJSON().should.eql({
      read: {
        authorized: ['subject-1'],
        blocked: [],
        public: false,
      },
      write: {
        authorized: ['subject-1'],
        blocked: [],
        public: false,
      },
    });
  });

  it('should do nothing if the list exists', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1'],
      },
    });

    acl.ensurePermissionList('read');

    acl.toJSON().should.eql({
      read: {
        authorized: ['subject-1'],
        blocked: [],
        public: false,
      },
    })
  });

  it('should require permission to be a String', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1'],
      },
    });

    assert.throws(function () {
      acl.ensurePermissionList();
    });
  });
});

describe('ACL#toJSON()', function () {
  it('should generate a POJO representation that may be reloaded', function () {
    var acl = new ACL({
      read: {
        authorized: ['subject-1'],
      },
      write: {},
      delete: {},
    });

    acl.authorize('subject-1', 'write');
    acl.authorize('subject-2', 'read');
    acl.makePublic('delete');

    acl.block('subject-2', 'delete');

    acl.can('subject-1', ['read', 'write', 'delete']).should.eql(true);
    acl.can('subject-2', 'read').should.eql(true);
    acl.can('subject-2', 'write').should.eql(false);
    acl.can('subject-2', 'delete').should.eql(false);

    acl.toJSON().should.eql({
      read: {
        authorized: ['subject-1', 'subject-2'],
        blocked: [],
        public: false,
      },
      write: {
        authorized: ['subject-1'],
        blocked: [],
        public: false,
      },
      delete: {
        authorized: [],
        blocked: ['subject-2'],
        public: true,
      }
    });

    // reload the acl from JSON and verify
    // permissions structure is the same
    var acl2 = new ACL(acl.toJSON());

    acl.can('subject-1', ['read', 'write', 'delete']).should.eql(true);
    acl.can('subject-2', 'read').should.eql(true);
    acl.can('subject-2', 'write').should.eql(false);
    acl.can('subject-2', 'delete').should.eql(false);
  });
});
