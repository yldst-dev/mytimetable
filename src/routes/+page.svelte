<script lang="ts">
  import TimeTable from '$lib/TimeTable.svelte';
</script>

<svelte:head>
  <title>주간 강의 시간표</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏰</text></svg>">
</svelte:head>

<div class="min-h-screen bg-gray-100 py-6">
  <TimeTable />
</div>
