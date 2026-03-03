<script lang="ts">
	import { dayKeys, dayLabels } from '$lib/data/schedule';
	import type { ClassInfo, DayKey, SchedulePeriod } from '$lib/types/schedule';
	import {
		formatRoomDisplayMultiline,
		getBorderColor,
		getClassesByDay,
		getProfessorColor
	} from '$lib/utils/schedule';

	let {
		schedule,
		onClassSelect
	}: { schedule: SchedulePeriod[]; onClassSelect?: (classInfo: ClassInfo) => void } = $props();

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

<div class="space-y-4 px-2">
	{#each dayLabels as dayLabel, dayIndex (dayLabel)}
		{@const dayKey = dayKeys[dayIndex] as DayKey}
		{@const dayClasses = getClassesByDay(schedule, dayKey)}
		<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="rounded-t-lg bg-blue-500 px-4 py-3 text-white">
				<div class="flex items-center justify-between">
					<span class="text-lg font-bold">{dayLabel}요일</span>
					<span class="text-sm opacity-90">{dayClasses.length}개 수업</span>
				</div>
			</div>
			<div class="p-3">
				{#if dayClasses.length > 0}
					<div class="space-y-3">
						{#each dayClasses as item (`${item.period}-${item.classInfo.name}`)}
							<button
								type="button"
								onclick={() => onClassSelect?.(item.classInfo)}
								class="w-full rounded-lg border-l-4 bg-gray-50 p-3 {getBorderColor(
									item.classInfo.professor
								)} cursor-pointer text-left"
							>
								<div class="mb-2 flex items-start justify-between">
									<div class="flex items-center gap-2">
										<span class="rounded bg-white px-2 py-1 text-xs font-medium text-gray-600"
											>{item.period}</span
										>
										<span class="text-xs text-gray-500">{item.time}</span>
									</div>
									<div
										class="h-3 w-3 rounded-full {getProfessorColor(item.classInfo.professor)}"
									></div>
								</div>
								<div class="text-sm font-semibold text-gray-900">
									{item.classInfo.name}
								</div>
								{#if item.classInfo.name !== '채플'}
									<div class="mt-1 text-xs text-gray-600">
										{formatProfessorLabel(item.classInfo.professor, item.classInfo.name)}
									</div>
								{/if}
								<div class="mt-1">
									<span
										class="inline-flex rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs whitespace-pre-line text-gray-700"
									>
										{formatRoomCell(item.classInfo.room, item.classInfo.name)}
									</span>
								</div>
							</button>
						{/each}
					</div>
				{:else}
					<div class="py-6 text-center text-gray-400">
						<div class="text-lg">📅</div>
						<div class="mt-1 text-sm">이 날은 수업이 없습니다</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
