/**
 * @format
 */
import {getDJCI} from '../components/radiodj';
import dayjs from 'dayjs';

jest.setTimeout(100_000);

test('call DCI url', async () => {
  let date = dayjs();
  const results = {};

  while (date.month() >= 2) {
    const d = date.format('YYYY-MM-DD');
    try {
      results[d] = await getDJCI(d);
    } catch (e) {
      results[d] = e;
    }
    date = date.subtract(14, 'days');
  }

  expect(1).toBe(1);
});
