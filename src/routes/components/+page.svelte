<script lang="ts">
	import { resolve } from '$app/paths';
	import CourseDetailsPanel from '$lib/components/CourseDetailsPanel.svelte';
	import DesktopScheduleTable from '$lib/components/DesktopScheduleTable.svelte';
	import DetailsToggle from '$lib/components/DetailsToggle.svelte';
	import MobileScheduleBoard from '$lib/components/MobileScheduleBoard.svelte';
	import { scheduleData } from '$lib/data/schedule';
	import { getUniqueClasses } from '$lib/utils/schedule';

	let showDetails = true;
	const details = getUniqueClasses(scheduleData);

	function toggleDetails(): void {
		showDetails = !showDetails;
	}
</script>

<svelte:head>
	<title>컴포넌트 카탈로그</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
	<div class="mx-auto max-w-6xl space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h1 class="text-2xl font-bold text-slate-800">재사용 컴포넌트 카탈로그</h1>
			<a
				class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
				href={resolve('/')}>메인으로 이동</a
			>
		</div>

		<section class="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
			<h2 class="mb-4 text-lg font-semibold text-slate-800">DesktopScheduleTable</h2>
			<DesktopScheduleTable schedule={scheduleData} />
		</section>

		<section class="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
			<h2 class="mb-4 text-lg font-semibold text-slate-800">MobileScheduleBoard</h2>
			<MobileScheduleBoard schedule={scheduleData} />
		</section>

		<section class="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
			<h2 class="mb-4 text-lg font-semibold text-slate-800">DetailsToggle + CourseDetailsPanel</h2>
			<DetailsToggle {showDetails} onToggle={toggleDetails} />
			{#if showDetails}
				<CourseDetailsPanel items={details} />
			{/if}
		</section>
	</div>
</div>
