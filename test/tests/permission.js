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
