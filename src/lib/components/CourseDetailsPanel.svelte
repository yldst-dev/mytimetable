<script lang="ts">
	import type { CourseSummary } from '$lib/types/schedule';
	import { formatRoomDisplayMultiline } from '$lib/utils/schedule';

	let { items }: { items: CourseSummary[] } = $props();
	let selected: CourseSummary | null = $state(null);

	function openDetails(item: CourseSummary): void {
		selected = item;
	}

	function closeDetails(): void {
		selected = null;
	}

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && selected) {
			closeDetails();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
	class="mx-2 rounded-xl border-[0.5px] border-gray-200 bg-gray-50 p-3 transition-all duration-300 md:mx-0 md:p-4"
>
	<h3 class="mb-3 text-base font-bold text-gray-800 md:text-lg">강의 상세 정보</h3>
	<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
		{#each items as item (`${item.name}-${item.professor}-${item.code}`)}
			<button
				type="button"
				onclick={() => openDetails(item)}
				class="flex flex-col items-start gap-1 rounded-lg border border-gray-200 bg-white p-3 text-left text-sm transition hover:border-blue-300 hover:bg-blue-50"
			>
				<div class="flex items-center gap-2">
					<span class="h-3 w-3 rounded-full {item.color}"></span>
					<span class="font-semibold text-gray-900">{item.name}</span>
				</div>
				<span class="text-xs text-gray-600">교수: {item.professor}</span>
				<span class="text-xs text-gray-600">분반코드: {item.code}</span>
				<span class="text-xs text-blue-600">상세 보기</span>
			</button>
		{/each}
	</div>
</div>

{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div class="absolute inset-0 bg-black/45"></div>
		<div class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
			<div class="mb-4 flex items-start justify-between gap-3">
				<div>
					<h4 class="text-lg font-bold text-gray-900">{selected.name}</h4>
					<p class="text-sm text-gray-600">교수: {selected.professor}</p>
				</div>
				<button
					type="button"
					onclick={closeDetails}
					class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
				>
					닫기
				</button>
			</div>

			<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
				<div class="rounded-lg bg-gray-50 p-3 text-sm">
					<span class="font-semibold">분반코드:</span>
					{selected.code}
				</div>
				<div class="rounded-lg bg-gray-50 p-3 text-sm">
					<span class="font-semibold">학과명:</span>
					{selected.department}
				</div>
				<div class="rounded-lg bg-gray-50 p-3 text-sm">
					<span class="font-semibold">학점:</span>
					{selected.credits}
				</div>
				<div class="rounded-lg bg-gray-50 p-3 text-sm">
					<span class="font-semibold">강의구분:</span>
					{selected.category}
				</div>
			</div>

			<div class="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
				<div class="mb-2 font-semibold">수업 시간</div>
				<div class="flex flex-wrap gap-2">
					{#each selected.sessions as session (session)}
						<span
							class="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700"
							>{session}</span
						>
					{/each}
				</div>
			</div>

			<div class="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
				<div class="mb-2 font-semibold">강의실</div>
				<div class="flex flex-wrap gap-2">
					{#each selected.rooms as room (room)}
						<span
							class="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs whitespace-pre-line text-gray-700"
							>{formatRoomDisplayMultiline(room)}</span
						>
					{/each}
				</div>
			</div>

			<div class="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
				<div class="mb-1 font-semibold">강의설명</div>
				<p>{selected.description}</p>
			</div>
		</div>
	</div>
{/if}
