const nunjucks = require('nunjucks');
const should = require('should');

describe('nunjucks', () => {
  it('nunjucks', () => {
    const s = nunjucks.renderString('Hello {{u.username}}', {u: {username: 'abc'}});
    s.should.be.exactly('Hello abc');
  });
});
