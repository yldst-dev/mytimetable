import type { ClassInfo, DayKey, SchedulePeriod } from '$lib/types/schedule';

export const dayLabels = ['월', '화', '수', '목', '금'] as const;
export const dayKeys: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const defaultProfessorColor = 'bg-gray-200';

export const professorColors: Record<string, string> = {
	안기영: 'bg-amber-200',
	노금환: 'bg-orange-200',
	장준혁: 'bg-emerald-200',
	임화정: 'bg-sky-200',
	선교훈련팀1: 'bg-indigo-200'
};

type CourseMeta = Omit<ClassInfo, 'room'>;

function classAt(meta: CourseMeta, room: string): ClassInfo {
	return {
		...meta,
		room
	};
}

const operatingSystem: CourseMeta = {
	name: '운영체제',
	professor: '장준혁',
	code: '12624-01',
	department: '컴퓨터공학과',
	credits: 3,
	category: '전선',
	description:
		'운영체제는 컴퓨터 하드웨어와 소프트웨어를 관리하는 기본 관리자다. 운영체제의 개념과 목적, 프로세스 관리, 메모리 관리, 파일 시스템 관리 등 운영체제 핵심 기능을 학습한다.'
};

const cloudComputing: CourseMeta = {
	name: '클라우드컴퓨팅',
	professor: '임화정',
	code: '25243-01',
	department: '컴퓨터공학과',
	credits: 3,
	category: '전선',
	description:
		'클라우드 컴퓨팅은 인터넷 기반 인프라에서 서비스를 제공하는 기술이다. 분산 컴퓨팅 자원과 가상화 구조, 구성 요소, 보안, 최신 서비스를 학습한다.'
};

const financialEngineering: CourseMeta = {
	name: '금융공학개론',
	professor: '노금환',
	code: '25596-01',
	department: '금융학전공',
	credits: 3,
	category: '전선',
	description:
		'금융시장 분석과 위험 관리에 사용하는 수학적 기초를 다룬다. 확률, 통계, 최적화 개념을 바탕으로 금융공학의 기본 모델과 방법을 학습한다.'
};

const chapel: CourseMeta = {
	name: '채플',
	professor: '선교훈련팀1',
	code: '13479-04',
	department: '선교훈련팀',
	credits: 0,
	category: '교필',
	description:
		'신입학생 대상 채플 과정으로 기독교적 인성과 공동체성을 다룬다. 수강생은 지정 강의에 참여하며 관련 프로그램을 통해 소양을 기른다.'
};

const programmingLanguages: CourseMeta = {
	name: '프로그래밍언어론',
	professor: '안기영',
	code: '17582-01',
	department: '컴퓨터공학과',
	credits: 3,
	category: '전선',
	description:
		'추상화와 설계 기준, 자료형, 제어구조, 객체지향 개념 등 프로그래밍 언어의 핵심 이론을 다룬다. 문법과 실행 모델을 분석해 다양한 패러다임을 이해한다.'
};

export const scheduleData: SchedulePeriod[] = [
	{
		period: '2교시',
		time: '10:00~10:50',
		classes: {
			mon: null,
			tue: null,
			wed: null,
			thu: classAt(operatingSystem, '강의실/090519-0'),
			fri: null
		}
	},
	{
		period: '3교시',
		time: '11:00~11:50',
		classes: {
			mon: null,
			tue: null,
			wed: null,
			thu: classAt(operatingSystem, '강의실/090519-0'),
			fri: null
		}
	},
	{
		period: '4교시',
		time: '12:00~12:50',
		classes: {
			mon: null,
			tue: null,
			wed: null,
			thu: null,
			fri: classAt(operatingSystem, '강의실/090517-0')
		}
	},
	{
		period: '5교시',
		time: '13:00~13:50',
		classes: {
			mon: null,
			tue: null,
			wed: classAt(programmingLanguages, '강의실/090519-0'),
			thu: classAt(financialEngineering, '강의실/060510-0'),
			fri: classAt(cloudComputing, 'PC실-C(컴공과)/090221-0')
		}
	},
	{
		period: '6교시',
		time: '14:00~14:50',
		classes: {
			mon: null,
			tue: classAt(chapel, '성지관 대강당/060141-0'),
			wed: null,
			thu: classAt(financialEngineering, '강의실/060510-0'),
			fri: classAt(cloudComputing, 'PC실-C(컴공과)/090221-0')
		}
	},
	{
		period: '7교시',
		time: '15:00~15:50',
		classes: {
			mon: null,
			tue: null,
			wed: classAt(financialEngineering, '강의실/060510-0'),
			thu: classAt(cloudComputing, '강의실/090219-0'),
			fri: null
		}
	},
	{
		period: '8교시',
		time: '16:00~16:50',
		classes: {
			mon: classAt(programmingLanguages, '강의실/090519-0'),
			tue: null,
			wed: null,
			thu: classAt(cloudComputing, '강의실/090219-0'),
			fri: null
		}
	},
	{
		period: '9교시',
		time: '17:00~17:50',
		classes: {
			mon: classAt(programmingLanguages, '강의실/090519-0'),
			tue: null,
			wed: null,
			thu: null,
			fri: null
		}
	}
];
