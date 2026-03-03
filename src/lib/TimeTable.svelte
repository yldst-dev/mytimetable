<script lang="ts">
	import { scheduleData } from '$lib/data/schedule';
	import type { ClassInfo, CourseSummary } from '$lib/types/schedule';
	import CourseDetailsModal from '$lib/components/CourseDetailsModal.svelte';
	import DesktopScheduleTable from '$lib/components/DesktopScheduleTable.svelte';
	import MobileSwipeSchedule from '$lib/components/MobileSwipeSchedule.svelte';
	import { getUniqueClasses } from '$lib/utils/schedule';

	let selectedCourse: CourseSummary | null = null;
	const details = getUniqueClasses(scheduleData);

	function openCourseDetails(classInfo: ClassInfo): void {
		const key = `${classInfo.name}::${classInfo.professor}::${classInfo.code}`;
		const match = details.find((item) => `${item.name}::${item.professor}::${item.code}` === key);
		selectedCourse = match ?? null;
	}

	function closeCourseDetails(): void {
		selectedCourse = null;
	}
</script>

<div
	class="flex h-full min-h-0 w-full flex-col overflow-hidden md:mx-auto md:my-5 md:max-w-5xl md:rounded-xl md:bg-white md:p-5"
>
	<h1 class="mb-2 flex-none text-center text-xl font-bold text-gray-800 md:mb-5 md:text-2xl">
		주간 강의 시간표
	</h1>

	<div class="min-h-0 flex-1 md:hidden">
		<MobileSwipeSchedule schedule={scheduleData} onClassSelect={openCourseDetails} />
	</div>

	<div class="hidden md:block">
		<DesktopScheduleTable schedule={scheduleData} onClassSelect={openCourseDetails} />
	</div>

	<CourseDetailsModal selected={selectedCourse} onClose={closeCourseDetails} />
</div>
