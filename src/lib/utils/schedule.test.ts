import { describe, expect, it } from 'vitest';
import { scheduleData } from '../data/schedule';
import {
	formatRoomDisplay,
	getClassesByDay,
	getProfessorColor,
	getUniqueClasses
} from './schedule';

describe('schedule utils', () => {
	it('returns mapped color for known professor', () => {
		expect(getProfessorColor('노금환')).toBe('bg-orange-200');
	});

	it('returns default color for unknown professor', () => {
		expect(getProfessorColor('unknown')).toBe('bg-gray-200');
	});

	it('formats room labels by removing generic prefix', () => {
		expect(formatRoomDisplay('강의실/090519-0')).toBe('090519-0');
		expect(formatRoomDisplay('성지관 대강당/060141-0')).toBe('성지관 대강당/060141-0');
	});

	it('returns day classes without null cells', () => {
		const monday = getClassesByDay(scheduleData, 'mon');
		expect(monday.length).toBe(2);
		expect(monday[0].period).toBe('8교시');
	});

	it('builds unique class summary list with detail fields', () => {
		const details = getUniqueClasses(scheduleData);
		expect(details.length).toBe(5);
		expect(details.some((item) => item.name === '클라우드컴퓨팅' && item.code === '25243-01')).toBe(
			true
		);
		expect(details.some((item) => item.sessions.length > 0 && item.rooms.length > 0)).toBe(true);
	});
});
