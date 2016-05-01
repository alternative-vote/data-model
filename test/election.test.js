'use strict';
const test = require('tape');
const Election = require('../src/election').Election;

test('election constructor', (t) => {
  const election = new Election();

  t.ok(election.start);

  t.end();
});
