var common = require('../../lib/common');

var expect = require('chai').expect;

describe('Test functions in lib/common.js', () => {
  it('[func] prd/dev check', () => {
    expect(common.onProd()).to.not.be.ok;
  });

  it('[func] convert object to array', () => {
    expect(common.obj2arr({a: 1})).to.be.deep.equal(['a', 1]);
  });
});
