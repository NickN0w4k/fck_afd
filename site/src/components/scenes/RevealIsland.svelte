<script>
  import { scale } from 'svelte/transition';
  import { factList } from '../../scripts/textsplit.js';
  let { teaser, headline, body } = $props();
  let open = $state(false);
  const items = $derived(open ? factList(body, 200) : []);
</script>

{#if !open}
  <button class="teaser" onclick={() => (open = true)}>
    <span class="teaser-ring" aria-hidden="true"></span>
    <span>{teaser}</span>
  </button>
{:else}
  <div class="card" transition:scale>
    <h2>{@html headline}</h2>
    <ul class="fact-list">
      {#each items as item, i}
        <li style="--i:{i}">{@html item}</li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .teaser {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
    padding: 3rem;
    border: 1px dashed var(--border);
    border-radius: 18px;
    width: 100%;
    color: var(--fg-muted);
    font-family: var(--font-head);
    letter-spacing: 0.08em;
    transition: border-color 0.2s, color 0.2s, transform 0.15s var(--ease-out);
  }
  .teaser:hover {
    border-color: var(--accent);
    color: var(--fg);
    transform: scale(1.01);
  }
  .teaser:active {
    transform: scale(0.99);
  }
  .teaser-ring {
    width: 54px;
    height: 54px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    position: relative;
    animation: pulse 2s ease-in-out infinite;
  }
  .teaser-ring::after {
    content: '+';
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 1.6rem;
    color: var(--accent);
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.12); opacity: 0.7; }
  }
  @media (prefers-reduced-motion: reduce) {
    .teaser-ring { animation: none; }
  }
  .card {
    padding: clamp(1.5rem, 4vw, 2.5rem);
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 18px;
  }
  .card h2 {
    font-size: clamp(1.4rem, 3.6vw, 2.2rem);
    color: var(--accent);
  }
  .card p {
    margin-top: 1rem;
    color: var(--fg);
  }
  .fact-list {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
  }
  .fact-list li {
    border-left: 3px solid var(--accent);
    padding-left: 0.9rem;
    margin: 0.8rem 0;
    line-height: 1.5;
    animation: fact-in 0.5s var(--ease-out) both;
    animation-delay: calc(var(--i) * 120ms);
  }
  @keyframes fact-in {
    from { opacity: 0; transform: translateX(-8px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .fact-list li { animation: none; }
  }
</style>