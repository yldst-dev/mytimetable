import { dayKeys, dayLabels, defaultProfessorColor, professorColors } from '$lib/data/schedule';
import type { CourseSummary, DayKey, DayScheduleItem, SchedulePeriod } from '$lib/types/schedule';

export function getProfessorColor(professor: string): string {
	return professorColors[professor] ?? defaultProfessorColor;
}

export function getBorderColor(professor: string): string {
	return getProfessorColor(professor).replace('bg-', 'border-');
}

export function formatRoomDisplay(room: string): string {
	return room.replace(/^강의실\//, '');
}

export function formatRoomDisplayMultiline(room: string): string {
	const normalized = formatRoomDisplay(room);
	return normalized.replace(/\//g, '\n');
}

export function getClassesByDay(schedule: SchedulePeriod[], dayKey: DayKey): DayScheduleItem[] {
	return schedule
		.map((period) => {
			const classInfo = period.classes[dayKey];
			if (!classInfo) {
				return null;
			}
			return {
				period: period.period,
				time: period.time,
				classInfo
			};
		})
		.filter((item): item is DayScheduleItem => item !== null);
}

export function getUniqueClasses(schedule: SchedulePeriod[]): CourseSummary[] {
	const dayLabelByKey = Object.fromEntries(
		dayKeys.map((key, index) => [key, dayLabels[index]])
	) as Record<DayKey, string>;
	const unique = new Map<string, CourseSummary>();

	for (const period of schedule) {
		for (const dayKey of dayKeys) {
			const classInfo = period.classes[dayKey];
			if (!classInfo) {
				continue;
			}
			const key = `${classInfo.name}::${classInfo.professor}::${classInfo.code}`;
			const roomInfo = formatRoomDisplay(classInfo.room);
			const sessionInfo = `${dayLabelByKey[dayKey]} ${period.period} (${period.time})`;
			const current = unique.get(key);

			if (!current) {
				unique.set(key, {
					name: classInfo.name,
					professor: classInfo.professor,
					color: getProfessorColor(classInfo.professor),
					code: classInfo.code,
					department: classInfo.department,
					credits: classInfo.credits,
					category: classInfo.category,
					description: classInfo.description,
					rooms: [roomInfo],
					sessions: [sessionInfo]
				});
				continue;
			}

			if (!current.rooms.includes(roomInfo)) {
				current.rooms = [...current.rooms, roomInfo];
			}
			if (!current.sessions.includes(sessionInfo)) {
				current.sessions = [...current.sessions, sessionInfo];
			}
		}
	}

	return Array.from(unique.values());
}
