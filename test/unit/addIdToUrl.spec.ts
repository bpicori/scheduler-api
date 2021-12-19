import { assert } from 'chai';
import { addIdToUrl } from '../../src/helpers/addIdToUrl';

describe('addIdToUrl', () => {
  it('url: http://example.com -> http://example.com/1', () => {
    const url = addIdToUrl('http://example.com', 1);
    assert.equal(url, 'http://example.com/1');
  });
  it('url: http://example.com/test -> http://example.com/test/1', () => {
    const url = addIdToUrl('http://example.com/test', 1);
    assert.equal(url, 'http://example.com/test/1');
  });
  it('url: http://example.com/test?param=1 -> http://example.com/test/1?param=1', () => {
    const url = addIdToUrl('http://example.com/test?param=1', 1);
    assert.equal(url, 'http://example.com/test/1?param=1');
  });
  it('url: http://example.com/test/?param=1 -> http://example.com/test/1?param=1', () => {
    const url = addIdToUrl('http://example.com/test?param=1', 1);
    assert.equal(url, 'http://example.com/test/1?param=1');
  });
  it('url: http://localhost:3001/test?a=1 -> http://localhost:3001/test/1?a=1', () => {
    const url = addIdToUrl('http://localhost:3001/test?a=1', 1);
    assert.equal(url, 'http://localhost:3001/test/1?a=1');
  });
});
