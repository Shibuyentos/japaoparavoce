<script lang="ts">
	import { formatDay, formatWeekday } from '#lib/format.ts';
	import type { DailyOrderCount } from '#lib/types.ts';

	type Props = {
		days: DailyOrderCount[];
		// id do título que dá nome ao gráfico.
		labelledby: string;
	};

	let { days, labelledby }: Props = $props();

	const DAYS_BETWEEN_LABELS = 7;

	const id = $props.id();

	const highest = $derived(Math.max(...days.map((day) => day.count)));
	const step = $derived(axisStep(highest));
	const axisMax = $derived(Math.ceil(highest / step) * step);
	const ticks = $derived(Array.from({ length: axisMax / step + 1 }, (_, index) => index * step));

	// Dia em destaque: o que está sob o ponteiro ou o escolhido pelas setas do teclado.
	let active = $state<number | null>(null);

	// Menor degrau "redondo" (1, 2, 5, 10, 20, 50…) que cobre o maior valor em até 4 divisões.
	function axisStep(value: number): number {
		for (let scale = 1; ; scale *= 10) {
			for (const round of [1, 2, 5]) {
				if (value <= round * scale * 4) return round * scale;
			}
		}
	}

	function dayLabel(date: string): string {
		return `${formatWeekday(date)} ${formatDay(date)}`;
	}

	function countLabel(count: number): string {
		return count === 1 ? '1 pedido' : `${count} pedidos`;
	}

	// O ponteiro só precisa estar na faixa do dia, não em cima da barra.
	function activateUnderPointer(event: PointerEvent & { currentTarget: HTMLElement }) {
		const bounds = event.currentTarget.getBoundingClientRect();
		const index = Math.floor(((event.clientX - bounds.left) / bounds.width) * days.length);
		active = Math.min(Math.max(index, 0), days.length - 1);
	}

	function moveWithKeyboard(event: KeyboardEvent) {
		const last = days.length - 1;
		const current = active ?? last;
		const targets: Record<string, number> = {
			ArrowLeft: current - 1,
			ArrowRight: current + 1,
			Home: 0,
			End: last
		};
		if (!(event.key in targets)) return;

		event.preventDefault();
		active = Math.min(Math.max(targets[event.key], 0), last);
	}
</script>

{#if highest === 0}
	<p class="empty">Nenhum pedido nos últimos {days.length} dias.</p>
{:else}
	<div class="plot">
		{#each ticks as tick (tick)}
			<div class="gridline" style:bottom="{(tick / axisMax) * 100}%" aria-hidden="true">
				<span>{tick}</span>
			</div>
		{/each}

		<!-- Uma lista de opções é o que deixa o gráfico com uma única parada de Tab e as
		     setas lendo um dia por vez, também no leitor de tela. -->
		<div
			class="columns"
			role="listbox"
			tabindex="0"
			aria-labelledby={labelledby}
			aria-activedescendant={active === null ? undefined : `${id}-${active}`}
			onpointermove={activateUnderPointer}
			onpointerdown={activateUnderPointer}
			onpointerleave={(event) => {
				// No toque não existe "sair de cima": o destaque fica até o gráfico perder o foco.
				if (event.pointerType === 'mouse') active = null;
			}}
			onfocus={() => (active ??= days.length - 1)}
			onblur={() => (active = null)}
			onkeydown={moveWithKeyboard}
		>
			{#each days as day, index (day.date)}
				<div
					class="column"
					class:active={index === active}
					role="option"
					id="{id}-{index}"
					aria-selected={index === active}
					aria-label="{dayLabel(day.date)}: {countLabel(day.count)}"
				>
					<div class="bar" style:height="{(day.count / axisMax) * 100}%"></div>
					{#if index === active}
						<div class="tooltip" class:from-right={index >= days.length / 2} aria-hidden="true">
							<strong>{countLabel(day.count)}</strong>
							{dayLabel(day.date)}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div class="x-axis" aria-hidden="true">
		{#each days as day, index (day.date)}
			<div>
				{#if (days.length - 1 - index) % DAYS_BETWEEN_LABELS === 0}
					<span>{formatDay(day.date)}</span>
				{/if}
			</div>
		{/each}
	</div>

	<details>
		<summary>Ver como tabela</summary>
		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th>Dia</th>
						<th class="number">Pedidos</th>
					</tr>
				</thead>
				<tbody>
					{#each days.toReversed() as day (day.date)}
						<tr>
							<td>{dayLabel(day.date)}</td>
							<td class="number">{day.count}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</details>
{/if}

<style>
	.empty {
		margin: 0;
		color: var(--ink-soft);
	}

	/* A faixa acima da área do gráfico é reservada para a etiqueta do dia em destaque. */
	.plot {
		position: relative;
		height: 180px;
		margin: 44px 0 0 30px;
	}

	.gridline {
		position: absolute;
		left: 0;
		right: 0;
		border-top: 1px solid var(--line);
	}

	.gridline:first-child {
		border-color: var(--line);
	}

	.gridline span {
		position: absolute;
		right: 100%;
		margin-right: 8px;
		transform: translateY(-50%);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	.columns {
		position: absolute;
		inset: 0;
		display: flex;
		border-radius: 6px;
		touch-action: pan-y;
	}

	.column {
		position: relative;
		flex: 1;
		min-width: 0;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.column.active {
		background: var(--blush);
	}

	/* O espaço de 2px entre as barras vem da largura, não de uma borda. */
	.bar {
		width: calc(100% - 2px);
		max-width: 24px;
		border-radius: 2px 2px 0 0;
		background: var(--beni);
	}

	.active .bar {
		filter: brightness(0.82);
	}

	.tooltip {
		position: absolute;
		bottom: 100%;
		left: 0;
		margin-bottom: 6px;
		padding: 5px 10px;
		border-radius: 4px;
		background: var(--ink);
		color: var(--white);
		font-size: 12.5px;
		line-height: 1.35;
		white-space: nowrap;
		pointer-events: none;
	}

	/* Na metade direita a etiqueta abre para a esquerda, para não sair do quadro. */
	.tooltip.from-right {
		left: auto;
		right: 0;
	}

	.tooltip strong {
		display: block;
		font-size: 14px;
	}

	.x-axis {
		display: flex;
		margin-left: 30px;
		height: 24px;
	}

	.x-axis div {
		position: relative;
		flex: 1;
		min-width: 0;
	}

	.x-axis span {
		position: absolute;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}

	.x-axis div:last-child span {
		left: auto;
		right: 0;
		transform: none;
	}

	details {
		margin-top: 10px;
		font-size: 14.5px;
	}

	summary {
		width: fit-content;
		font-weight: 700;
		color: var(--beni);
		cursor: pointer;
	}

	.table-scroll {
		max-height: 240px;
		margin-top: 8px;
		overflow-y: auto;
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}

	th,
	td {
		padding: 6px 12px;
		text-align: left;
		border-bottom: 1px solid var(--line);
	}

	th {
		position: sticky;
		top: 0;
		background: var(--blush);
		font-size: 13px;
		color: var(--ink-soft);
	}

	.number {
		text-align: right;
	}
</style>
