<script lang="ts">
	import type { CourseSummary } from '$lib/types/schedule';
	import { formatRoomDisplayMultiline } from '$lib/utils/schedule';

	let { selected, onClose }: { selected: CourseSummary | null; onClose: () => void } = $props();

	function handleWindowKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && selected) {
			onClose();
		}
	}

	function getRoomLabel(room: string, courseName: string | null): string {
		return courseName === '채플' ? '바136' : formatRoomDisplayMultiline(room);
	}

	const chapelSeatGuide = '해당 좌석 앞번호는 121번';
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if selected}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			class="absolute inset-0 z-0 bg-black/45"
			onclick={(event) => {
				if (event.currentTarget === event.target) {
					onClose();
				}
			}}
			aria-label="모달 닫기"
		></button>
		<div class="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
			<div class="mb-4 flex items-start justify-between gap-3">
				<div>
					<h4 class="text-lg font-bold text-gray-900">{selected.name}</h4>
					<p class="text-sm text-gray-600">교수: {selected.professor}</p>
				</div>
				<button
					type="button"
					onclick={onClose}
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
							>{getRoomLabel(room, selected.name)}</span
						>
					{/each}
				</div>
				{#if selected.name === '채플'}
					<div class="mt-2 rounded bg-amber-50 p-2 text-xs text-amber-700">{chapelSeatGuide}</div>
				{/if}
			</div>

			<div class="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
				<div class="mb-1 font-semibold">강의설명</div>
				<p>{selected.description}</p>
			</div>
		</div>
	</div>
{/if}
