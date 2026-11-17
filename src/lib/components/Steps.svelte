<script lang="ts">
	type Step = { title: string; text: string };

	let { steps }: { steps: Step[] } = $props();
</script>

<ol class="steps">
	{#each steps as step, index (step.title)}
		<li>
			<span class="number" aria-hidden="true">{index + 1}</span>
			<div>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</div>
		</li>
	{/each}
</ol>

<style>
	.steps {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 4px;
		padding: 16px 0;
		border-top: 1px solid var(--line);
	}

	li:last-child {
		border-bottom: 1px solid var(--line);
	}

	.number {
		font-family: var(--font-display);
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1;
		color: var(--beni);
	}

	p {
		margin-top: 4px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
	}

	/* Em telas largas os passos ficam lado a lado, na ordem de leitura. */
	@media (min-width: 900px) {
		.steps {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 28px;
		}

		li,
		li:last-child {
			display: block;
			padding: 16px 0 0;
			border-top: 2px solid var(--ink);
			border-bottom: none;
		}

		.number {
			display: block;
			margin-bottom: 10px;
			font-size: 2.25rem;
		}
	}
</style>
