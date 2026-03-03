import { describe, expect, it } from 'vitest';
import { dayKeys, dayLabels, scheduleData } from '../data/schedule';

describe('desktop table data contract', () => {
	it('keeps day label and key counts aligned', () => {
		expect(dayLabels.length).toBe(dayKeys.length);
	});

	it('ensures each period contains all weekday keys', () => {
		for (const period of scheduleData) {
			expect(Object.keys(period.classes).sort()).toEqual([...dayKeys].sort());
		}
	});

	it('contains ordered period labels from 2교시 to 9교시', () => {
		expect(scheduleData[0].period).toBe('2교시');
		expect(scheduleData[scheduleData.length - 1].period).toBe('9교시');
	});
});
