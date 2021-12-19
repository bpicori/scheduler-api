import { assert } from 'chai';
import { unix } from '../../src/helpers/unix';
import { convertTimerToUnix } from '../../src/helpers/convertTimerToUnix';

describe('convertTimerToUnix', async () => {
  it('should return unix current time + 3 seconds', () => {
    const time = unix();
    const converted = convertTimerToUnix({
      hours: 0,
      minutes: 0,
      seconds: 3,
    });
    assert.equal(converted, time + 3);
  });
  it('should return unix current time + 2 minutes', () => {
    const time = unix();
    const converted = convertTimerToUnix({
      hours: 0,
      minutes: 2,
      seconds: 0,
    });
    assert.equal(converted, time + 2 * 60);
  });
  it('should return unix current time + 1 hours + 2 minutes', () => {
    const time = unix();
    const converted = convertTimerToUnix({
      hours: 1,
      minutes: 2,
      seconds: 0,
    });
    assert.equal(converted, time + 2 * 60 + 3600);
  });
});
