var common = require('../../lib/common');

var expect = require('chai').expect;

describe('Test functions in lib/common.js', () => {
  it('[func] prd/dev env check', () => {
    expect(common.onProd()).to.not.be.ok;
  });

  it('[func] convert object to array', () => {
    expect(common.obj2arr({a: 1})).to.be.deep.equal(['a', 1]);
  });

  it('[func] convert filename to array', () => {
    expect(common.getArticleNameArr('67*当Promise遇上闭包*20151220*JavaScript-Promise-Closuer.md')).to.be.deep.equal([
      '67',
      '当Promise遇上闭包',
      '20151220',
      'JavaScript-Promise-Closuer.md'
    ]);
  });
});
