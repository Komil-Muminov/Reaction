<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let running = false;
	let prep = false;
	let targetVisible = false;
	let message = 'Нажми "Старт" чтобы начать';
	let lastTime: number | null = null;
	let times: number[] = [];
	let roundsDone = 0;

	// Settings (persisted)
	let rounds: number = 10;
	let minDelay: number = 1000;
	let maxDelay: number = 3000;
	let autoRestart = false;
	let useSpace = false;

	const timerRef: { current: number | null } = { current: null };
	const shownAtRef: { current: number | null } = { current: null };
	const prepRef: { current: boolean } = { current: false };

	// load persisted settings & times
	onMount(() => {
		const vRounds = localStorage.getItem('rt_rounds');
		if (vRounds) rounds = Number(vRounds);
		const vMin = localStorage.getItem('rt_minDelay');
		if (vMin) minDelay = Number(vMin);
		const vMax = localStorage.getItem('rt_maxDelay');
		if (vMax) maxDelay = Number(vMax);
		const vAuto = localStorage.getItem('rt_auto');
		if (vAuto) autoRestart = vAuto === '1';
		const vSpace = localStorage.getItem('rt_space');
		if (vSpace) useSpace = vSpace === '1';

		const vTimes = localStorage.getItem('rt_times');
		if (vTimes) {
			try {
				times = JSON.parse(vTimes);
			} catch (e) {
				times = [];
			}
		}

		function onKey(e: KeyboardEvent) {
			if (useSpace && e.code === 'Space') {
				e.preventDefault();
				handleClick();
			}
		}

		window.addEventListener('keydown', onKey);
		onDestroy(() => {
			window.removeEventListener('keydown', onKey);
			if (timerRef.current) window.clearTimeout(timerRef.current);
		});
	});

	$: localStorage.setItem('rt_rounds', String(rounds));
	$: localStorage.setItem('rt_minDelay', String(minDelay));
	$: localStorage.setItem('rt_maxDelay', String(maxDelay));
	$: localStorage.setItem('rt_auto', autoRestart ? '1' : '0');
	$: localStorage.setItem('rt_space', useSpace ? '1' : '0');

	function randomDelay() {
		const min = Math.max(0, Number(minDelay));
		const max = Math.max(min, Number(maxDelay));
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function startRound() {
		message = 'Жди...';
		prep = true;
		prepRef.current = true;
		targetVisible = false;
		const delay = randomDelay();
		timerRef.current = window.setTimeout(() => {
			prepRef.current = false;
			shownAtRef.current = performance.now();
			targetVisible = true;
			message = 'КЛИК!';
		}, delay);
	}

	function stopAll() {
		if (timerRef.current) {
			window.clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		running = false;
		prep = false;
		targetVisible = false;
		message = 'Остановлено';
	}

	function handleStart() {
		times = [];
		roundsDone = 0;
		lastTime = null;
		running = true;
		message = 'Готов...';

		// small timeout so UI updates
		setTimeout(() => startRound(), 200);
	}

	function handleClick() {
		if (!running) return;

		const now = performance.now();

		if (prepRef.current && !targetVisible) {
			message = 'Ранний клик! Попробуй ещё раз.';
			prep = false;
			prepRef.current = false;
			if (timerRef.current) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			const penalty = 800;
			recordTime(penalty);
			scheduleNextOrStop();
			return;
		}

		if (targetVisible && shownAtRef.current) {
			const delta = Math.max(0, Math.round(now - shownAtRef.current));
			recordTime(delta);
			targetVisible = false;
			shownAtRef.current = null;
			scheduleNextOrStop();
			return;
		}
	}

	function recordTime(ms: number) {
		lastTime = ms;
		times = [...times, ms];
		localStorage.setItem('rt_times', JSON.stringify(times));
		roundsDone = roundsDone + 1;
		message = `Результат: ${ms} мс`;
	}

	function scheduleNextOrStop() {
		if (roundsDone >= rounds) {
			running = false;
			message = 'Серия завершена';
			prep = false;
			prepRef.current = false;
			targetVisible = false;
		} else if (autoRestart) {
			setTimeout(() => startRound(), 700);
		} else {
			message = 'Нажми "Далее" чтобы продолжить';
			prep = false;
			prepRef.current = false;
		}
	}

	function resetAll() {
		stopAll();
		times = [];
		lastTime = null;
		roundsDone = 0;
		message = 'Сброшено';
		localStorage.removeItem('rt_times');
	}

	const best = () => (times.length ? Math.min(...times) : null);
	const avg = () =>
		times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null;
</script>

<div class="mx-auto max-w-3xl p-6">
	<h2 class="mb-4 text-2xl font-semibold">Тренер реакции — простая версия</h2>

	<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="col-span-2">
			<div class="relative flex h-56 items-center justify-center rounded-lg bg-gray-100 p-4">
				<button
					on:click={handleClick}
					class={`reaction-area h-full w-full rounded-lg focus:outline-none ${targetVisible ? 'active' : ''}`}
					aria-label="reaction-area"
					style={`background: ${targetVisible ? 'linear-gradient(90deg,yellow,orange)' : 'transparent'}; cursor: ${running ? 'pointer' : 'default'}`}
				>
					<div class="text-center">
						<div class="mb-2 text-xl font-bold">{message}</div>
						<div class="text-sm text-gray-600">
							{running ? `Раунд ${roundsDone + 1} / ${rounds}` : ''}
						</div>
						{#if lastTime !== null}
							<div class="mt-3 font-mono text-3xl">{lastTime} ms</div>
						{/if}
					</div>
				</button>
			</div>

			<div class="mt-3 flex gap-2">
				{#if !running}
					<button class="rounded bg-blue-600 px-3 py-2 text-white" on:click={handleStart}
						>Старт</button
					>
				{/if}
				{#if running}
					<button class="rounded bg-red-600 px-3 py-2 text-white" on:click={stopAll}>Стоп</button>
				{/if}
				{#if !running}
					<button
						class="rounded bg-green-600 px-3 py-2 text-white"
						on:click={() => {
							startRound();
							running = true;
						}}>Далее</button
					>
				{/if}
				<button class="rounded bg-gray-300 px-3 py-2" on:click={resetAll}>Сброс</button>
			</div>
		</div>

		<aside class="rounded bg-white p-4 shadow">
			<h3 class="font-semibold">Статистика</h3>
			<div class="mt-2 text-sm">
				<div>Раунды: <strong>{roundsDone}/{rounds}</strong></div>
				<div>Последний: <strong>{lastTime ?? '-'} ms</strong></div>
				<div>Лучший: <strong>{best() ?? '-'} ms</strong></div>
				<div>Средний: <strong>{avg() ?? '-'} ms</strong></div>
			</div>

			<div class="mt-4">
				<h4 class="font-semibold">Настройки</h4>
				<label class="mt-2 block text-sm"
					>Раунды
					<input type="number" min="1" bind:value={rounds} class="mt-1 w-full rounded border p-2" />
				</label>
				<label class="mt-2 block text-sm"
					>Минимальная задержка (мс)
					<input
						type="number"
						min="0"
						bind:value={minDelay}
						class="mt-1 w-full rounded border p-2"
					/>
				</label>
				<label class="mt-2 block text-sm"
					>Максимальная задержка (мс)
					<input
						type="number"
						min="0"
						bind:value={maxDelay}
						class="mt-1 w-full rounded border p-2"
					/>
				</label>
				<label class="mt-2 flex items-center gap-2 text-sm">
					<input type="checkbox" bind:checked={autoRestart} /> Авто-раунды
				</label>
				<label class="mt-1 flex items-center gap-2 text-sm">
					<input type="checkbox" bind:checked={useSpace} /> Использовать пробел
				</label>
			</div>
		</aside>
	</div>

	<div class="mt-4 rounded bg-white p-3 shadow">
		<h4 class="mb-2 font-semibold">Все показатели</h4>
		<div class="flex flex-wrap gap-2">
			{#if times.length}
				{#each times as t, i}
					<div class="rounded border px-2 py-1 font-mono text-sm">{i + 1}: {t} ms</div>
				{/each}
			{:else}
				<div class="text-sm text-gray-500">Пока нет результатов</div>
			{/if}
		</div>
	</div>

	<div class="mt-4 text-xs text-gray-600">
		Сохранение настроек: localStorage. Поддерживается клик мышью и (опционально) пробел.
	</div>
</div>

<style>
	.reaction-area {
		transition: transform 0.12s ease;
	}
	.reaction-area.active {
		transform: scale(1.03);
	}
</style>
