<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';

	type Props = {
		text: string;
		label: string;
		copiedLabel: string;
		primary?: boolean;
		// Chamado quando o navegador não deixa usar a área de transferência.
		onfail?: () => void;
	};

	let { text, label, copiedLabel, primary = false, onfail }: Props = $props();

	const FEEDBACK_MS = 2600;

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => (copied = false), FEEDBACK_MS);
		} catch {
			onfail?.();
		}
	}
</script>

<button class="btn {primary ? 'btn-primary' : 'btn-quiet'}" type="button" onclick={copy}>
	{#if copied}
		<Check aria-hidden="true" />{copiedLabel}
	{:else}
		<Copy aria-hidden="true" />{label}
	{/if}
</button>
<p class="visually-hidden" role="status">{copied ? `${copiedLabel}.` : ''}</p>
