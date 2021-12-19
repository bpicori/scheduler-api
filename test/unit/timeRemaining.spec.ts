import { assert } from 'chai';
import { timeRemaining } from '../../src/helpers/timeRemaining';
import { unix } from '../../src/helpers/unix';

describe('timeRemaining', async () => {
  it('should return the correct time remaining', () => {
    const time = unix();
    const result = timeRemaining(time + 1);
    assert.equal(result, 1);
  });
  it('should return 0 if time passed', () => {
    const time = unix() - 100;
    const result = timeRemaining(time);
    assert.equal(result, 0);
  });
});
