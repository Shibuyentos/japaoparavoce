<script lang="ts">
	type Step = { title: string; text: string };

	let { steps }: { steps: Step[] } = $props();
</script>

<ol class="steps">
	{#each steps as step, index (step.title)}
		<li>
			<div class="number" aria-hidden="true">{index + 1}</div>
			<h3>{step.title}</h3>
			<p>{step.text}</p>
		</li>
	{/each}
</ol>

<style>
	.steps {
		display: grid;
		grid-template-columns: 1fr;
		gap: 14px;
		margin: 30px 0 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 700px) {
		.steps {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1000px) {
		.steps {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	li {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 22px 20px;
	}

	.number {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--pink);
		color: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 19px;
		margin-bottom: 12px;
	}

	h3 {
		font-size: 18px;
		margin-bottom: 6px;
	}

	p {
		margin: 0;
		color: var(--muted);
		font-size: 15.5px;
	}
</style>
