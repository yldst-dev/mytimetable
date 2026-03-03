<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { dayKeys, dayLabels } from '$lib/data/schedule';
	import type { ClassInfo, SchedulePeriod } from '$lib/types/schedule';
	import DesktopScheduleTable from './DesktopScheduleTable.svelte';

	let {
		schedule,
		onClassSelect
	}: { schedule: SchedulePeriod[]; onClassSelect?: (classInfo: ClassInfo) => void } = $props();

	let activeDayIndex = $state(getCurrentWeekdayIndex());
	let rootElement: HTMLDivElement | null = null;
	let headerElement: HTMLDivElement | null = null;
	let viewportElement: HTMLDivElement | null = null;
	let controlsElement: HTMLDivElement | null = null;
	let isDragging = $state(false);
	let isHorizontalSwipe = $state(false);
	let startX = $state(0);
	let startY = $state(0);
	let dragOffset = $state(0);
	let dayWidth = $state(0);
	let tableViewportHeight = $state(0);
	let resizeObserver: ResizeObserver | null = null;

	const currentIndicator = $derived(activeDayIndex);
	const timeColumnWidthPercent = 25;
	const dragThresholdRatio = 0.2;
	const periodCellMinHeight = $derived.by(() => {
		const rowCount = Math.max(schedule.length, 1);
		if (tableViewportHeight <= 0) {
			return '42px';
		}
		const estimatedHeaderHeight = 34;
		const bodyHeight = Math.max(0, tableViewportHeight - estimatedHeaderHeight);
		const cellHeight = Math.floor(bodyHeight / rowCount) - 4;
		return `${Math.max(38, cellHeight)}px`;
	});
	const currentTranslateX = $derived.by(() => {
		if (dayWidth <= 0) {
			return 0;
		}
		const baseTranslate = -activeDayIndex * dayWidth;
		return baseTranslate + (isDragging && isHorizontalSwipe ? dragOffset : 0);
	});
	const trackTransition = $derived.by(() =>
		isDragging && isHorizontalSwipe ? 'none' : 'transform 220ms ease'
	);

	function getCurrentWeekdayIndex(): number {
		const weekday = new Date().getDay();
		if (weekday >= 1 && weekday <= 5) {
			return weekday - 1;
		}
		return 0;
	}

	function clampIndex(index: number): number {
		return Math.max(0, Math.min(dayKeys.length - 1, index));
	}

	function goToDay(index: number): void {
		activeDayIndex = clampIndex(index);
	}

	function updateViewportMetrics(): void {
		if (!rootElement || !viewportElement) {
			return;
		}
		dayWidth = viewportElement.clientWidth;
		const rootHeight = rootElement.clientHeight;
		const headerHeight = headerElement?.clientHeight ?? 0;
		const controlsHeight = controlsElement?.clientHeight ?? 0;
		const verticalGap = 16;
		const nextHeight = Math.max(0, rootHeight - headerHeight - controlsHeight - verticalGap);
		tableViewportHeight = nextHeight;
	}

	function finalizeSwipe(offsetX: number): void {
		if (!dayWidth) {
			return;
		}
		const moveRatio = Math.abs(offsetX) / dayWidth;
		if (moveRatio >= dragThresholdRatio) {
			if (offsetX < 0) {
				activeDayIndex = clampIndex(activeDayIndex + 1);
			} else if (offsetX > 0) {
				activeDayIndex = clampIndex(activeDayIndex - 1);
			}
		}
	}

	function onDragStart(event: PointerEvent): void {
		if (!viewportElement) {
			return;
		}
		isDragging = true;
		isHorizontalSwipe = false;
		startX = event.clientX;
		startY = event.clientY;
		dragOffset = 0;
	}

	function onDragMove(event: PointerEvent): void {
		if (!isDragging || !viewportElement || !isHorizontalSwipe) {
			if (!isDragging || !viewportElement) {
				return;
			}
			const moveX = event.clientX - startX;
			const moveY = event.clientY - startY;
			const absX = Math.abs(moveX);
			const absY = Math.abs(moveY);
			if (absX < 8 && absY < 8) {
				return;
			}
			if (absY >= absX) {
				isDragging = false;
				return;
			}
			isHorizontalSwipe = true;
		}
		event.preventDefault();
		const moveX = event.clientX - startX;
		const edgeLeft = activeDayIndex === 0;
		const edgeRight = activeDayIndex === dayKeys.length - 1;
		if ((edgeLeft && moveX > 0) || (edgeRight && moveX < 0)) {
			dragOffset = moveX * 0.3;
			return;
		}
		dragOffset = moveX;
	}

	function onDragEnd(): void {
		if (!viewportElement) {
			isDragging = false;
			isHorizontalSwipe = false;
			dragOffset = 0;
			return;
		}
		if (isHorizontalSwipe) {
			finalizeSwipe(dragOffset);
		}
		isDragging = false;
		isHorizontalSwipe = false;
		dragOffset = 0;
	}

	onMount(() => {
		updateViewportMetrics();
		const handleResize = () => {
			updateViewportMetrics();
		};
		window.addEventListener('resize', handleResize);
		if (rootElement || headerElement || controlsElement) {
			resizeObserver = new ResizeObserver(() => {
				updateViewportMetrics();
			});
			if (rootElement) {
				resizeObserver.observe(rootElement);
			}
			if (headerElement) {
				resizeObserver.observe(headerElement);
			}
			if (controlsElement) {
				resizeObserver.observe(controlsElement);
			}
		}
		return () => {
			window.removeEventListener('resize', handleResize);
			resizeObserver?.disconnect();
			resizeObserver = null;
		};
	});

	onDestroy(() => {
		resizeObserver?.disconnect();
		resizeObserver = null;
	});
</script>

<div bind:this={rootElement} class="flex h-full min-h-0 flex-col gap-2 overflow-hidden px-0 pb-0">
	<div bind:this={headerElement} class="flex items-center justify-between px-2">
		<div class="text-sm font-semibold text-gray-700">{dayLabels[currentIndicator]}요일</div>
		<div class="text-xs text-gray-500">{currentIndicator + 1} / {dayLabels.length}</div>
	</div>
	<div
		bind:this={viewportElement}
		class="min-h-0 overflow-hidden"
		style:height={`${tableViewportHeight}px`}
		style:touch-action="pan-x"
		style:--swipe-x={`${currentTranslateX}px`}
		style:--swipe-transition={trackTransition}
		onpointerdown={onDragStart}
		onpointermove={onDragMove}
		onpointerup={onDragEnd}
		onpointercancel={onDragEnd}
		onpointerleave={onDragEnd}
		role="region"
		tabindex="-1"
		aria-label="요일 스와이프"
	>
		<div
			class="flex h-full w-full"
			style="transform: translateX(var(--swipe-x)); transition: var(--swipe-transition);"
		>
			{#each dayKeys as dayKey, dayIndex (dayKey)}
				<div class="w-full flex-none overflow-hidden">
					<DesktopScheduleTable
						{schedule}
						{onClassSelect}
						dayKeysToShow={[dayKey]}
						dayLabelsToShow={[dayLabels[dayIndex]]}
						{timeColumnWidthPercent}
						{periodCellMinHeight}
						enableTableHorizontalScroll={false}
					/>
				</div>
			{/each}
		</div>
	</div>
	<div bind:this={controlsElement} class="grid flex-none grid-cols-5 gap-1 px-1 py-1">
		{#each dayLabels as dayLabel, dayIndex (dayIndex)}
			<button
				type="button"
				class={`h-7 rounded-md border text-xs font-semibold transition ${dayIndex === currentIndicator ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 bg-white text-gray-700'}`}
				onclick={() => goToDay(dayIndex)}
				aria-label={`${dayLabel} 이동`}
			>
				{dayLabel}
			</button>
		{/each}
	</div>
</div>
