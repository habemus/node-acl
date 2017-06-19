// own
const aux = require('./auxiliary');

function validateSubjectsArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('authorized must be an Array');
  }

  arr.forEach((subject) => {
    if (typeof subject !== 'string') {
      throw new TypeError('subject MUST be of type String');
    }
  });
}

/**
 * PermissionList {
 *   authorized: [String],
 *   blocked: [String],
 *   public: Boolean
 * }
 */
function PermissionList(data) {
  data = data || {};

  this.authorized = data.authorized || [];
  this.blocked    = data.blocked    || [];

  validateSubjectsArray(this.authorized);
  validateSubjectsArray(this.blocked);

  this.public = data.public || false;

  if (typeof this.public !== 'boolean') {
    throw new TypeError('public must be a Boolean');
  }
}

/**
 * Adds the given subject identifier to the list
 * of authorized subjects.
 * @param  {String} subject
 */
PermissionList.prototype.authorize = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  this.authorized = aux.arrayAddUnique(this.authorized, subject); 
};

/**
 * Removes the given subject identifier from the list
 * of authorized subjects.
 * @param  {String} subject
 */
PermissionList.prototype.unauthorize = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  this.authorized = aux.arrayRemove(this.authorized, subject); 
};

/**
 * Checks whether the given subject is in the list of authorized
 * subjects
 * @param  {String}  subject
 * @return {Boolean}
 */
PermissionList.prototype.isAuthorized = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  return aux.arrayHas(this.authorized, subject);
};

/**
 * Adds the given subject identifier to the list
 * of blocked subjects.
 * @param  {String} subject
 */
PermissionList.prototype.block = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  this.blocked = aux.arrayAddUnique(this.blocked, subject); 
};

/**
 * Removes the given subject identifier from the list
 * of blocked subjects.
 * @param  {String} subject
 */
PermissionList.prototype.unblock = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  this.blocked = aux.arrayRemove(this.blocked, subject); 
};

/**
 * Checks whether the given subject is in the list of blocked
 * subjects
 * @param  {String}  subject
 * @return {Boolean}
 */
PermissionList.prototype.isBlocked = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  return aux.arrayHas(this.blocked, subject);
};

/**
 * Makes the PermissionList public:
 * All subjects are allowed unless they've been blocked.
 */
PermissionList.prototype.makePublic = function () {
  this.public = true;
};

/**
 * Makes the PermissionList private.
 * No subjects are allowed unless they've been explicitly authorized.
 */
PermissionList.prototype.makePrivate = function () {
  this.public = false;
};

/**
 * Checks whether the PermissionList is public
 */
PermissionList.prototype.isPublic = function () {
  return this.public;
};

/**
 * Verifies whether the given subject has PermissionList
 * to execute the action represented by the PermissionList instance.
 *
 * Verifies, in order:
 *   - whether the subject has been blocked
 *   - whether the PermissionList is public
 *   - whether the subject has been authorized
 * 
 * @param  {String} subject
 */
PermissionList.prototype.isAllowed = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  if (this.isBlocked(subject)) {
    return false;
  }

  if (this.isPublic()) {
    return true;
  }

  return this.isAuthorized(subject);
};

/**
 * JSON object for storage
 * @return {Object}
 */
PermissionList.prototype.toJSON = function () {
  return {
    authorized: this.authorized,
    blocked: this.blocked,
    public: this.public,
  };
};

module.exports = PermissionList;
