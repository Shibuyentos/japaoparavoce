<script lang="ts">
	type Step = { title: string; text: string };

	let { steps }: { steps: Step[] } = $props();
</script>

<!-- Os passos ficam ligados por uma linha: em pé no celular, deitada nas telas largas. -->
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
		position: relative;
		display: grid;
		grid-template-columns: 38px 1fr;
		gap: 16px;
		padding-bottom: 26px;
	}

	li:last-child {
		padding-bottom: 0;
	}

	li:not(:last-child)::before {
		content: '';
		position: absolute;
		top: 42px;
		bottom: 4px;
		left: 18px;
		border-left: 1.5px solid var(--blush-strong);
	}

	.number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border: 1.5px solid var(--beni);
		border-radius: 50%;
		background: var(--surface);
		font-size: 1.0625rem;
		font-stretch: var(--narrow);
		font-weight: 700;
		color: var(--beni);
	}

	h3 {
		padding-top: 7px;
	}

	p {
		margin-top: 4px;
		font-size: 0.9375rem;
		color: var(--ink-soft);
		text-wrap: pretty;
	}

	@media (min-width: 900px) {
		.steps {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 32px;
		}

		li {
			display: block;
			padding-bottom: 0;
		}

		li:not(:last-child)::before {
			top: 19px;
			right: -32px;
			bottom: auto;
			left: 50px;
			border-top: 1.5px solid var(--blush-strong);
			border-left: none;
		}

		h3 {
			margin-top: 16px;
			padding-top: 0;
		}
	}
</style>
