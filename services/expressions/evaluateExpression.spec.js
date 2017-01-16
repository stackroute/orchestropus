const nunjucks = require('nunjucks');

describe('nunjucks', () => {
  it('nunjucks', () => {
    const s = nunjucks.renderString('Hello {{u.username}}', {u: {username: 'Sagar'}});
    console.log('s:', s);
  });
});
