<script lang="ts">
	import { onMount } from 'svelte';
	import { CUSTOMER_TIME_ZONE } from '#lib/config.ts';

	type Props = {
		// Dia em que o passo aconteceu. Sem data, o carimbo mostra só o sinal de conferido.
		date?: Date | null;
		// O painel fixa o horário do Japão; sem isso vale o fuso do aparelho de quem vê.
		timeZone?: string;
		size?: number;
	};

	let { date = null, timeZone, size = 56 }: Props = $props();

	// Como em LocalDate: o servidor usa o horário de Brasília e o navegador troca pelo do aparelho.
	let deviceZone = $state<string | undefined>(CUSTOMER_TIME_ZONE);

	onMount(() => {
		deviceZone = undefined;
	});

	const parts = $derived.by(() => {
		if (!date) return null;

		const zone = timeZone ?? deviceZone;
		const format = (options: Intl.DateTimeFormatOptions) =>
			new Intl.DateTimeFormat('pt-BR', { ...options, timeZone: zone }).format(date);

		return {
			dayMonth: `${format({ day: 'numeric' })} ${format({ month: 'short' }).replace('.', '').toUpperCase()}`,
			year: format({ year: 'numeric' })
		};
	});
</script>

<!-- O carimbo de data do correio japonês: um círculo com três faixas, a do meio com a data.
     Aqui ele marca o que já foi feito e conferido. -->
<svg class="seal" viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
	<circle cx="32" cy="32" r="30" />
	{#if parts}
		<line x1="3.6" y1="22.5" x2="60.4" y2="22.5" />
		<line x1="3.6" y1="41.5" x2="60.4" y2="41.5" />
		<text class="band" x="32" y="17.6">JAPAN</text>
		<text class="date" x="32" y="36">{parts.dayMonth}</text>
		<text class="band" x="32" y="52.4">{parts.year}</text>
	{:else}
		<circle class="inner" cx="32" cy="32" r="24.5" />
		<path d="M21.5 32.5l7 7 14-15" />
	{/if}
</svg>

<style>
	.seal {
		flex: none;
		color: var(--beni);
		transform: rotate(-12deg);
		overflow: visible;
	}

	circle,
	line,
	path {
		fill: none;
		stroke: currentColor;
	}

	circle {
		stroke-width: 2.4;
	}

	.inner,
	line {
		stroke-width: 1.2;
	}

	path {
		stroke-width: 3.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	text {
		fill: currentColor;
		font-family: var(--font);
		text-anchor: middle;
	}

	.band {
		font-size: 6.6px;
		font-weight: 650;
		letter-spacing: 1.1px;
	}

	.date {
		font-size: 12px;
		font-stretch: var(--narrow);
		font-weight: 750;
	}
</style>
