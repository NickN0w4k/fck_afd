<script>
  import { slide } from 'svelte/transition';
  import { factList } from '../../scripts/textsplit.js';
  let {
    min = 0,
    max = 100,
    answer,
    unit = '',
    explanation,
    per_head,
    per_family,
    per_family_label,
  } = $props();

  let val = $state(Math.round((min + max) / 2));
  let shown = $state(Math.round((min + max) / 2));
  let revealed = $state(false);

  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const explItems = $derived(revealed ? factList(explanation ?? '', 160) : []);

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

  const toPct = (v) => Math.max(0, Math.min(100, Math.round(((v - min) / (max - min || 1)) * 100)));

  function reveal() {
    revealed = true;
    if (reduced) {
      shown = answer; // reduced-motion: Endwert direkt
      return;
    }
    // Readout zählt von der eigenen Schätzung auf den wahren Wert (snap auf ganze Zahlen)
    const from = val;
    const dur = 1200;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
      shown = Math.round(from + (answer - from) * e);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
</script>

<div class="slider">
  <div class="readout" aria-live={revealed ? 'off' : 'polite'}>
    <span class="val">{revealed ? shown : val}</span><span class="unit">{unit}</span>
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
    <button class="submit" onclick={reveal}>Auflösen</button>
  {:else}
    <div class="result" transition:slide>
      <p class="verdict">{verdict}</p>
      <p class="answer">Antwort: <strong>{answer}{unit}</strong></p>
      <div class="diff" role="img" aria-label={`Deine Schätzung ${val}${unit}, Wahrheit ${answer}${unit}`}>
        <div class="bar-row">
          <span class="bar-label">Deine Schätzung</span>
          <div class="bar-track"><div class="bar-fill est" style={`--w: ${toPct(val)}%`} /></div>
          <span class="bar-val">{val}{unit}</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">Wahrheit</span>
          <div class="bar-track"><div class="bar-fill truth" style={`--w: ${toPct(answer)}%`} /></div>
          <span class="bar-val">{answer}{unit}</span>
        </div>
      </div>
      <div class="expl">
        {#each explItems as item, i}
          <p style="--i:{i}">{@html item}</p>
        {/each}
      </div>
      {#if per_head}
        <div class="per-you">
          <p class="per-head">Rund <strong>{per_head.toLocaleString('de-DE')} € pro Kopf</strong></p>
          {#if per_family_label}
            <p class="per-family" style={`--target:${per_family?.toLocaleString('de-DE') ?? ''}`}>{per_family_label}</p>
          {/if}
        </div>
      {/if}
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
  /* Differenz-Balken (data-bar-Muster): Deine Schätzung vs. Wahrheit, gestaffelt */
  .diff {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.9rem;
  }
  .bar-row {
    display: grid;
    grid-template-columns: minmax(6rem, 8.5rem) 1fr auto;
    align-items: center;
    gap: 0.75rem;
  }
  .bar-label {
    font-family: var(--font-head);
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    color: var(--fg-muted);
  }
  .bar-track {
    height: 12px;
    background: rgba(245, 242, 236, 0.08);
    border-radius: 99px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 99px;
    width: 0%;
    animation: bar-grow 1.1s var(--ease-out) both;
  }
  .bar-fill.est {
    background: var(--fg-muted);
  }
  .bar-fill.truth {
    background: var(--accent);
    animation-delay: 0.18s;
  }
  .bar-val {
    font-family: var(--font-head);
    font-size: 0.8rem;
    color: var(--fg-muted);
    font-variant-numeric: tabular-nums;
  }
  @keyframes bar-grow {
    from { width: 0%; }
    to { width: var(--w); }
  }
  .expl {
    margin-top: 0.6rem;
    color: var(--fg-muted);
  }
  /* Du-Ebene (3.6 Kosten-Du-Rechner): Milliarden → persönlicher Betrag */
  .per-you {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .per-head {
    padding: 0.85rem 1rem;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    border-radius: 10px;
    font-size: 1.05rem;
    line-height: 1.5;
  }
  .per-head strong {
    font-family: var(--font-head);
    font-size: 1.3em;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }
  .per-family {
    color: var(--fg-muted);
    line-height: 1.5;
  }
  .expl p {
    margin: 0.4rem 0;
    padding-left: 0.9rem;
    border-left: 2px solid var(--accent);
    animation: fact-in 0.45s var(--ease-out) both;
    animation-delay: calc(var(--i) * 140ms);
    line-height: 1.5;
  }
  .expl p:first-child {
    margin-top: 0;
  }
  .expl p:last-child {
    margin-bottom: 0;
  }
  @keyframes fact-in {
    from { opacity: 0; transform: translateX(-8px); }
  }
  @media (max-width: 767px) {
    .bar-row {
      grid-template-columns: minmax(4.6rem, 6rem) 1fr auto;
      gap: 0.5rem;
    }
    .bar-label {
      font-size: 0.72rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .expl p { animation: none; }
    .bar-fill { animation: none; width: var(--w); }
  }
</style>