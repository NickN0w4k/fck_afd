<script>
  let { min = 0, max = 100, answer, unit = '', explanation } = $props();

  let val = $state(Math.round((min + max) / 2));
  let revealed = $state(false);

  const diff = $derived(Math.abs(val - answer));
  const verdict = $derived(
    diff <= Math.max(2, (max - min) * 0.03)
      ? 'Sehr gut geschätzt.'
      : diff <= (max - min) * 0.15
        ? 'Nah dran.'
        : val < answer
          ? 'Deutlich zu niedrig geschätzt.'
          : 'Deutlich zu hoch geschätzt.',
  );
</script>

<div class="slider">
  <div class="readout" aria-live="polite">
    <span class="val">{val}</span><span class="unit">{unit}</span>
  </div>
  <input
    type="range"
    bind:value={val}
    {min}
    {max}
    step="1"
    aria-label="Deine Schätzung"
    disabled={revealed}
  />
  {#if !revealed}
    <button class="submit" onclick={() => (revealed = true)}>Auflösen</button>
  {:else}
    <div class="result" transition:slide>
      <p class="verdict">{verdict}</p>
      <p class="answer">Antwort: <strong>{answer}{unit}</strong></p>
      <p class="expl">{explanation}</p>
    </div>
  {/if}
</div>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .readout {
    font-family: var(--font-head);
    font-size: clamp(3.5rem, 14vw, 8rem);
    font-weight: 700;
    line-height: 1;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }
  .unit {
    font-size: 0.5em;
    color: var(--fg);
  }
  input[type='range'] {
    width: 100%;
    accent-color: var(--accent);
    height: 2rem;
  }
  input:disabled {
    opacity: 0.4;
  }
  .submit {
    align-self: flex-start;
    padding: 0.8rem 1.6rem;
    background: var(--accent);
    color: var(--accent-contrast);
    border-radius: 99px;
    font-family: var(--font-head);
    font-weight: 600;
    transition: transform 0.15s var(--ease-out);
  }
  .submit:hover {
    transform: scale(1.04);
  }
  .submit:active {
    transform: scale(0.97);
  }
  .result {
    padding: 1.2rem 1.4rem;
    background: var(--bg-elev);
    border-left: 3px solid var(--accent);
    border-radius: 0 12px 12px 0;
  }
  .verdict {
    font-family: var(--font-head);
    font-weight: 600;
  }
  .answer {
    margin-top: 0.4rem;
  }
  .expl {
    margin-top: 0.6rem;
    color: var(--fg-muted);
  }
</style>