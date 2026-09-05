<script>
  import { slide } from 'svelte/transition';
  // Svelte 5: runes-lose, einfache Props + State
  let { options, explanation } = $props();

  let picked = $state(null);

  function pick(i) {
    if (picked !== null) return; // nur einmal antworten
    picked = i;
  }

  const anyCorrect = options.some((o) => o.correct);
</script>

<div class="options" role="group" aria-label="Antwortmöglichkeiten">
  {#each options as opt, i (i)}
    <button
      class="option"
      class:correct={picked !== null && opt.correct}
      class:wrong={picked === i && !opt.correct}
      class:dim={picked !== null && !opt.correct && picked !== i}
      class:flip={picked !== null}
      onclick={() => pick(i)}
      disabled={picked !== null}
    >
      <span class="option-text">{opt.text}</span>
      {#if picked !== null && opt.correct}
        <span class="mark" aria-hidden="true">✓</span>
      {:else if picked === i && !opt.correct}
        <span class="mark" aria-hidden="true">✗</span>
      {/if}
    </button>
  {/each}
</div>

{#if picked !== null}
  <p class="explanation" role="status" aria-live="polite" transition:slide>{explanation}</p>
{/if}

{#if !anyCorrect}
  <p class="warn">Konfigurationsfehler: keine Antwort als korrekt markiert.</p>
{/if}

<style>
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    text-align: left;
    padding: 1.1rem 1.3rem;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-elev);
    transition: transform 0.15s var(--ease-out), border-color 0.2s, background 0.2s, opacity 0.2s;
  }
  .option:not(:disabled):hover {
    transform: scale(1.015);
    border-color: var(--accent);
  }
  .option:not(:disabled):active {
    transform: scale(0.985);
  }
  .option:disabled {
    cursor: default;
  }
  .option.correct {
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
  }
  .option.wrong {
    border-color: #f87171;
    background: rgba(248, 113, 113, 0.1);
  }
  .option.dim {
    opacity: 0.4;
  }
  .option.flip {
    animation: flip 0.45s var(--ease-out);
  }
  @keyframes flip {
    0% { transform: rotateX(0); }
    50% { transform: rotateX(8deg) scale(0.98); }
    100% { transform: rotateX(0); }
  }
  .mark {
    font-weight: 700;
    color: #4ade80;
  }
  .option.wrong .mark {
    color: #f87171;
  }
  .explanation {
    margin-top: 1.5rem;
    padding: 1.1rem 1.3rem;
    background: var(--bg-elev);
    border-left: 3px solid var(--accent);
    border-radius: 0 12px 12px 0;
    color: var(--fg);
  }
</style>