const { format_date } = require('../utils/helpers');

test('format_date() returns a date string', () => {
    const date = new Date('2023-03-07 01:32:30');

    expect(format_date(date)).toBe('3/7/2023');
});