<script>
	let count = 0;

	function increment() {
		count += 1;
	}
</script>

<main>
	<div>
		<h1>Reaction App 🎯</h1>
		<p>FSD Architecture + Svelte + TypeScript</p>

		<button on:click={increment}>
			count is {count}
		</button>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	main {
		text-align: center;
		color: white;
	}

	div {
		padding: 2rem;
		background: rgba(0, 0, 0, 0.3);
		border-radius: 12px;
		backdrop-filter: blur(10px);
	}

	h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
	}

	p {
		margin: 0 0 2rem 0;
		opacity: 0.9;
		font-size: 1.1rem;
	}

	button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: 2px solid white;
		padding: 0.75rem 2rem;
		font-size: 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 600;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	button:active {
		transform: scale(0.95);
	}
</style>
