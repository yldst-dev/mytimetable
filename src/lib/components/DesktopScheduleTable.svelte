<script lang="ts">
	import { dayKeys, dayLabels } from '$lib/data/schedule';
	import type { ClassInfo, DayKey, SchedulePeriod } from '$lib/types/schedule';
	import { formatRoomDisplayMultiline, getProfessorColor } from '$lib/utils/schedule';

	let {
		schedule,
		onClassSelect,
		dayKeysToShow,
		dayLabelsToShow,
		enableTableHorizontalScroll,
		timeColumnWidthPercent,
		periodCellMinHeight
	}: {
		schedule: SchedulePeriod[];
		onClassSelect?: (classInfo: ClassInfo) => void;
		dayKeysToShow?: DayKey[];
		dayLabelsToShow?: string[];
		enableTableHorizontalScroll?: boolean;
		timeColumnWidthPercent?: number;
		periodCellMinHeight?: string;
	} = $props();

	const visibleDayKeys = $derived(dayKeysToShow ?? dayKeys);
	const visibleDayLabels = $derived(
		dayLabelsToShow && dayLabelsToShow.length === visibleDayKeys.length
			? dayLabelsToShow
			: visibleDayKeys.map((dayKey) => dayLabels[dayKeys.indexOf(dayKey)])
	);
	const timeColumnWidth = $derived(
		`${timeColumnWidthPercent ?? 100 / (visibleDayKeys.length + 1)}%`
	);
	const classColumnWidth = $derived(
		`${
			(100 - (timeColumnWidthPercent ?? 100 / (visibleDayKeys.length + 1))) / visibleDayKeys.length
		}%`
	);

	function getCellBackgroundColor(professor: string): string {
		return getProfessorColor(professor);
	}

	function isSameClass(a: ClassInfo | null, b: ClassInfo | null): boolean {
		if (!a || !b) {
			return false;
		}
		return (
			a.name === b.name && a.professor === b.professor && a.code === b.code && a.room === b.room
		);
	}

	function getRowSpan(
		periods: SchedulePeriod[],
		dayKey: (typeof dayKeys)[number],
		startIndex: number
	): number {
		const startClass = periods[startIndex]?.classes[dayKey];
		if (!startClass) {
			return 0;
		}
		let span = 0;
		for (let index = startIndex; index < periods.length; index++) {
			if (!isSameClass(startClass, periods[index]?.classes[dayKey])) {
				break;
			}
			span += 1;
		}
		return span;
	}

	function openClass(classInfo: ClassInfo | null): void {
		if (classInfo && onClassSelect) {
			onClassSelect(classInfo);
		}
	}

	function handleCellKeydown(event: KeyboardEvent, classInfo: ClassInfo | null): void {
		if (!classInfo || !onClassSelect) {
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onClassSelect(classInfo);
		}
	}

	function formatProfessorLabel(professor: string, className: string): string {
		return className === '채플' ? '' : `${professor} 교수님`;
	}

	function formatRoomCell(room: string, className: string): string {
		if (className === '채플') {
			const [roomName] = room.split('/');
			const normalizedRoom = roomName?.replace(/^강의실/, '').trim();
			return `${normalizedRoom} 바136`;
		}
		return formatRoomDisplayMultiline(room);
	}
</script>

<div
	class={`rounded-xl ${(enableTableHorizontalScroll ?? true) ? 'overflow-x-auto' : 'overflow-x-hidden'}`}
>
	<table class="mb-0 w-full border-collapse overflow-hidden text-center md:mb-5">
		<thead>
			<tr>
				<th
					class="rounded-tl-lg border-[0.5px] border-blue-400 bg-blue-500 p-1 text-[10px] text-white md:p-3 md:text-base"
					style={`width:${timeColumnWidth}`}
				>
					교시
				</th>
				{#each visibleDayLabels as dayLabel, dayIndex (dayLabel)}
					<th
						class="border-[0.5px] border-blue-400 bg-blue-500 p-1 text-[10px] text-white md:p-3 md:text-base {dayIndex ===
						visibleDayLabels.length - 1
							? 'rounded-tr-lg'
							: ''}"
						style={`width:${classColumnWidth}`}
					>
						{dayLabel}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each schedule as period, periodIndex (period.period)}
				<tr style={periodCellMinHeight ? `height:${periodCellMinHeight}` : ''}>
					<td
						class="border-[0.5px] border-gray-200 bg-gray-100 p-0 text-center md:p-3 {periodIndex ===
						schedule.length - 1
							? 'rounded-bl-lg'
							: ''}"
						style={`width:${timeColumnWidth}`}
					>
						<div
							class="flex h-full min-h-0 flex-col items-center justify-center"
							style={periodCellMinHeight ? `min-height:${periodCellMinHeight}` : ''}
						>
							<span class="text-[10px] font-medium md:text-sm">{period.period}</span>
							<span class="mt-0.5 block text-[8px] text-gray-500 md:mt-1 md:text-xs"
								>{period.time}</span
							>
						</div>
					</td>
					{#each visibleDayKeys as dayKey, dayIndex (dayKey)}
						{@const classInfo = period.classes[dayKey]}
						{@const prevClass = periodIndex > 0 ? schedule[periodIndex - 1].classes[dayKey] : null}
						{@const isBlockStart = !isSameClass(classInfo, prevClass)}
						{@const rowSpan = isBlockStart
							? classInfo
								? getRowSpan(schedule, dayKey, periodIndex)
								: 1
							: 1}
						{#if isBlockStart}
							<td
								rowspan={rowSpan}
								class="cursor-pointer border-[0.5px] border-gray-200 p-0 text-center md:p-0 {classInfo
									? getCellBackgroundColor(classInfo.professor)
									: 'bg-white'} {periodIndex === schedule.length - 1 &&
								dayIndex === visibleDayKeys.length - 1
									? 'rounded-br-lg'
									: ''}"
								onclick={() => openClass(classInfo)}
								onkeydown={(event) => handleCellKeydown(event, classInfo)}
								tabindex="0"
								role="button"
								aria-label={classInfo ? `${classInfo.name} 상세 보기` : '빈 셀'}
							>
								{#if classInfo}
									<div
										class="flex h-full flex-col justify-center gap-0.5 text-center text-gray-900 md:min-h-[76px]"
										style={`min-height:${periodCellMinHeight ?? '60px'}`}
									>
										<div class="text-[10px] font-semibold md:text-sm">{classInfo.name}</div>
										{#if classInfo.name !== '채플'}
											<div class="text-[9px] text-gray-600 md:text-xs">
												{formatProfessorLabel(classInfo.professor, classInfo.name)}
											</div>
										{/if}
										<div class="inline-flex justify-center">
											<span
												class="rounded-full border border-white/60 bg-white px-2 py-0.5 text-[10px] whitespace-pre-line text-gray-700 md:text-xs"
											>
												{formatRoomCell(classInfo.room, classInfo.name)}
											</span>
										</div>
									</div>
								{/if}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
