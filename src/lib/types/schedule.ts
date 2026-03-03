export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface ClassInfo {
	name: string;
	room: string;
	professor: string;
	code: string;
	department: string;
	credits: number;
	category: string;
	description: string;
}

export interface SchedulePeriod {
	period: string;
	time: string;
	classes: Record<DayKey, ClassInfo | null>;
}

export interface DayScheduleItem {
	period: string;
	time: string;
	classInfo: ClassInfo;
}

export interface CourseSummary {
	name: string;
	professor: string;
	color: string;
	code: string;
	department: string;
	credits: number;
	category: string;
	description: string;
	rooms: string[];
	sessions: string[];
}
