<script lang="ts">
	import { dev } from '$app/environment';
	import { resolve } from '$app/paths';
	import TimeTable from '$lib/TimeTable.svelte';
</script>

<svelte:head>
	<title>주간 강의 시간표</title>
</svelte:head>

<div class="flex h-[100dvh] flex-col overflow-hidden bg-gray-100 py-2 md:min-h-screen md:py-6">
	<div class="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-2 md:px-0">
		<div class="mb-3 flex flex-none items-center justify-between">
			<a
				href="/campus-map.pdf"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs hover:bg-gray-50 md:text-sm"
				>캠퍼스 맵 보기</a
			>
			{#if dev}
				<a
					href={resolve('/components')}
					class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs hover:bg-gray-50 md:text-sm"
					>컴포넌트 보기</a
				>
			{/if}
		</div>
		<div class="min-h-0 flex-1">
			<TimeTable />
		</div>
	</div>
</div>
