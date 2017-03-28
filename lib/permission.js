// own
const aux = require('./auxiliary');

function Permission(data) {
  data = data || {};

  this.authorized = data.authorized || [];
  this.blocked    = data.blocked    || [];

  this.public = data.public || false;
}

/**
 * Adds the given subject identifier to the list
 * of authorized subjects.
 * @param  {String} subject
 */
Permission.prototype.authorize = function (subject) {
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
Permission.prototype.unauthorize = function (subject) {
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
Permission.prototype.isAuthorized = function (subject) {
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
Permission.prototype.block = function (subject) {
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
Permission.prototype.unblock = function (subject) {
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
Permission.prototype.isBlocked = function (subject) {
  if (typeof subject !== 'string') {
    throw new TypeError('subject MUST be of type String');
  }

  return aux.arrayHas(this.blocked, subject);
};

/**
 * Makes the permission public:
 * All subjects are allowed unless they've been blocked.
 */
Permission.prototype.makePublic = function () {
  this.public = true;
};

/**
 * Makes the permission private.
 * No subjects are allowed unless they've been explicitly authorized.
 */
Permission.prototype.makePrivate = function () {
  this.public = false;
};

/**
 * Checks whether the permission is public
 */
Permission.prototype.isPublic = function () {
  return this.public;
};

/**
 * Verifies whether the given subject has permission
 * to execute the action represented by the permission instance.
 *
 * Verifies, in order:
 *   - whether the subject has been blocked
 *   - whether the permission is public
 *   - whether the subject has been authorized
 * 
 * @param  {String} subject
 */
Permission.prototype.can = function (subject) {
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
 * Verifies whether any of the given subjects has permission
 * to execute the action represented by the permission instance.
 * 
 * @param  {Array[String]} subjects
 * @return {Boolean}
 */
Permission.prototype.canAny = function (subjects) {
  return subjects.some((subject) => {
    return this.can(subject);
  });
};

/**
 * JSON object for storage
 * @return {Object}
 */
Permission.prototype.toJSON = function () {
  return {
    authorized: this.authorized,
    blocked: this.blocked,
    isPublic: this.isPublic,
  };
};

module.exports = Permission;
