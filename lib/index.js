// third-party
const Bluebird = require('bluebird');

// own
const Permission = require('./permission');

function ACL(permissions) {
  this.permissions = permissions || {};
}

ACL.prototype.ensurePermission = function (action) {
  return this.permissions[action] = this.permissions[action] || new Permission();
};

ACL.prototype.authorize = function (subject, action) {
  var permission = this.ensurePermission(action);

  permission.authorize(subject);
};

ACL.prototype.unauthorize = function (subject, action) {
  var permission = this.ensurePermission(action);

  permission.unauthorize(subject);
};

ACL.prototype.block = function (subject, action) {
  var permission = this.ensurePermission(action);

  permission.block(subject);
};

ACL.prototype.unblock = function (subject, action) {
  var permission = this.ensurePermission(action);

  permission.unblock(subject);
};

ACL.prototype.makePublic = function (action) {
  var permission = this.ensurePermission(action);

  permission.makePublic();
};

ACL.prototype.makePrivate = function (action) {
  var permission = this.ensurePermission(action);

  permission.makePrivate();
};

ACL.prototype.can = function (subject, action) {
  var permission = this.permissions[action];

  if (!permission) {
    return false;
  }

  return permission.can(subject);
};

ACL.prototype.canAny = function (subjects, action) {
  var permission = this.permissions[action];

  if (!permission) {
    return false;
  }

  return permission.canAny(subjects);
};

ACL.prototype.toJSON = function () {
  return Object.keys(this.permissions).reduce((res, action) => {
    res[action] = this.permissions.toJSON();
    return res;
  }, {});
};

module.exports = ACL;
