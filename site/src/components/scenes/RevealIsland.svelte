<script>
  import { scale } from 'svelte/transition';
  let { teaser, headline, body } = $props();
  let open = $state(false);
</script>

{#if !open}
  <button class="teaser" onclick={() => (open = true)}>
    <span class="teaser-ring" aria-hidden="true"></span>
    <span>{teaser}</span>
  </button>
{:else}
  <div class="card" transition:scale>
    <h2>{headline}</h2>
    <p>{body}</p>
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
</style>