<script lang="ts">
	let { showDetails, onToggle }: { showDetails: boolean; onToggle: () => void } = $props();
</script>

<div class="mt-2 mb-3 flex justify-center md:mt-0 md:mb-5">
	<button
		type="button"
		class="flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-800 transition-colors hover:bg-gray-200 md:text-base"
		onclick={onToggle}
	>
		<span class="hidden md:inline"
			>{showDetails ? '강의 상세 정보 숨기기' : '강의 상세 정보 보기'}</span
		>
		<span class="md:hidden">{showDetails ? '상세 숨기기' : '상세 보기'}</span>
		<span class="ml-1 md:hidden">{showDetails ? '▲' : '▼'}</span>
	</button>
</div>
