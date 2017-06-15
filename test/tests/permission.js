// native
const assert = require('assert');

// third-party
const should = require('should');

// own
const Permission = require('../../lib/permission');

describe('Permission#authorize(subject)', function () {

  it('should add the subject to the array of authorized subjects', function () {
    var p = new Permission();

    p.authorize('subject-1');

    p.can('subject-2').should.eql(false);
    p.can('subject-1').should.eql(true);
  });

  it('should require subject to be a String', function () {
    var p = new Permission();

    assert.throws(function () {
      p.authorize(undefined);
    });
  });

});

describe('Permission#unauthorize(subject)', function () {

  it('should remove the subject from the array of authorized subjects', function () {
    var p = new Permission({
      authorized: ['subject-1', 'subject-2'],
    });

    p.unauthorize('subject-1');

    p.can('subject-2').should.eql(true);
    p.can('subject-1').should.eql(false);
  });

  it('should require subject to be a String', function () {
    var p = new Permission();

    assert.throws(function () {
      p.unauthorize(undefined);
    });
  });
});


describe('Permission#block(subject)', function () {

  it('should add the subject to the array of blocked subjects', function () {
    var p = new Permission({
      authorized: ['subject-1', 'subject-2'],
    });

    p.block('subject-1');

    p.can('subject-2').should.eql(true);
    p.can('subject-1').should.eql(false);
  });

  it('should require subject to be a String', function () {
    var p = new Permission();

    assert.throws(function () {
      p.block(undefined);
    });
  });
});

describe('Permission#unblock(subject)', function () {

  it('should remove the subject to the array of blocked subjects', function () {
    var p = new Permission({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1', 'subject-2'],
    });

    p.unblock('subject-1');

    p.can('subject-2').should.eql(false);
    p.can('subject-1').should.eql(true);
  });

  it('should require subject to be a String', function () {
    var p = new Permission();

    assert.throws(function () {
      p.unblock(undefined);
    });
  });
});

describe('Permission#can(subject)', function () {

  it('should remove the subject to the array of blocked subjects', function () {
    var p = new Permission({
      authorized: ['subject-1', 'subject-2'],
      blocked: ['subject-1', 'subject-2'],
    });

    p.unblock('subject-1');

    p.can('subject-2').should.eql(false);
    p.can('subject-1').should.eql(true);
  });

});
