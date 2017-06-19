// third-party
const clone = require('clone');

// own
const PermissionList = require('./permission-list');

/**
 * ACL {
 *   lists: {
 *     *permission: PermissionList {
 *       authorized: [String],
 *       blocked: [String],
 *       public: Boolean
 *     }
 *   }
 * }
 * @param {Object} lists
 */
function ACL(lists) {
  this.lists = lists ? clone(lists) : {};

  // ensure all the lists passed in are instances of PermissionList
  Object.keys(this.lists).forEach((permission) => {
    if (!(this.lists[permission] instanceof PermissionList)) {
      this.lists[permission] = new PermissionList(this.lists[permission]);
    }
  });
}

/**
 * Retrieves a single PermissionList by permission name.
 * Throws error if permission does not exist.
 * 
 * @param  {String} permission
 * @return {PermissionList}
 */
ACL.prototype.getPermissionList = function (permission) {
  if (typeof permission !== 'string' || permission === '') {
    throw new Error('permission must be a non-empty string');
  }

  var list = this.lists[permission];

  if (!list) {
    throw new Error(`permission list for '${permission}' does not exist`);
  }

  return list;
};

/**
 * Ensures that a PermissionList for the given permission name
 * exists.
 * If exists, does not do anything.
 * Otherwise, creates.
 * 
 * @param  {String} permission
 * @return {PermissionList}
 */
ACL.prototype.ensurePermissionList = function (permission) {
  if (typeof permission !== 'string' || permission === '') {
    throw new Error('permission must be a non-empty string');
  }

  return this.lists[permission] = this.lists[permission] || new PermissionList();
};

/**
 * Authorizes a subject the given array of permissions
 * 
 * @param  {String} subject
 * @param  {String || [String]} permissions
 */
ACL.prototype.authorize = function (subject, permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.authorize(subject);
  });
};

/**
 * Unauthorizes the subject all the permissions
 * 
 * @param  {String} subject
 * @param  {String || [String]} permissions
 */
ACL.prototype.unauthorize = function (subject, permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.unauthorize(subject);
  });
};

/**
 * Blocks the subject from all permissions
 * 
 * @param  {String} subject
 * @param  {String || [String]} permissions
 */
ACL.prototype.block = function (subject, permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.block(subject);
  });
};

/**
 * Unblocks the subject from all permissions
 * 
 * @param  {String} subject
 * @param  {String || [String]} permissions
 */
ACL.prototype.unblock = function (subject, permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.unblock(subject);
  });
};

/**
 * Makes the given permission public
 * 
 * @param  {String || [String]} permissions
 */
ACL.prototype.makePublic = function (permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.makePublic(permission);
  });
};

/**
 * Makes the given permissions private
 * 
 * @param  {String || [String]} permissions
 */
ACL.prototype.makePrivate = function (permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  permissions.forEach((permission) => {
    var list = this.getPermissionList(permission);

    list.makePrivate(permission);
  });
};

/**
 * Checks whether the subject has been allowed all the
 * requested permissions.
 * 
 * @param  {String} subject
 * @param  {String || [String]} permissions
 * @return {Boolean}
 */
ACL.prototype.isAllowed = function (subject, permissions) {
  if (!permissions) {
    throw new Error('array of permissions is required');
  }

  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  if (permissions.length === 0) {
    throw new Error('array of permissions must not be empty');
  }

  return permissions.every((permission) => {

    if (typeof permission !== 'string' || permission === '') {
      throw new Error('permission must be a non-empty string');
    }

    var list = this.lists[permission];

    if (!list) {
      return false;
    }

    return list.isAllowed(subject);
  });
};

/**
 * Generates a JSON representation of the ACL.
 * @return {Object}
 * {
 *   permission1: {
 *     authorized: [String],
 *     blocked: [String],
 *     public: Boolean
 *   },
 *   permission2: {
 *     authorized: [String],
 *     blocked: [String],
 *     public: Boolean
 *   }
 * }
 */
ACL.prototype.toJSON = function () {
  return Object.keys(this.lists).reduce((res, permission) => {
    res[permission] = this.lists[permission].toJSON();
    return res;
  }, {});
};

module.exports = ACL;
