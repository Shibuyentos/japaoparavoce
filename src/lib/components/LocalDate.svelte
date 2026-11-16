<script lang="ts">
	import { onMount } from 'svelte';
	import { CUSTOMER_TIME_ZONE } from '#lib/config.ts';

	let { date }: { date: Date } = $props();

	// O servidor não sabe o fuso de quem vai ler: a página chega com a data no horário de
	// Brasília e, já no navegador, passa a usar o fuso do aparelho (timeZone indefinido).
	let timeZone = $state<string | undefined>(CUSTOMER_TIME_ZONE);

	onMount(() => {
		timeZone = undefined;
	});

	const text = $derived(
		new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone }).format(date)
	);
</script>

<time datetime={date.toISOString()}>{text}</time>
