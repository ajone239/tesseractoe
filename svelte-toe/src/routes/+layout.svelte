<script lang="ts">
    import '../app.css';
    import { onMount } from 'svelte';

    let { children } = $props();

    let playerId: string | null = $state('');

    onMount(() => {
        // Check if there's already a UUID in localStorage
        playerId = localStorage.getItem('playerId');
        if (!playerId) {
            playerId = crypto.randomUUID();
            localStorage.setItem('playerId', playerId);
        }
        console.log('Player ID:', playerId);
    });
</script>

<h1><a href="/"><u>Tesseractoe</u></a></h1>

<h3 class="playerid">You are {playerId}</h3>

{@render children()}

<style>
    :global(body) {
        background-color: #121212;
        color: #e0e0e0;
        font-family: system-ui, sans-serif;
        margin: 0;
        padding: 1rem;
    }

    :global(h1) {
        font-size: 1.5rem;
        margin-top: 2rem;
        padding-bottom: 0.5rem;
        color: #ffffff;
    }

    :global(h2) {
        font-size: 1.5rem;
        margin-top: 2rem;
        border-bottom: 1px solid #444;
        padding-bottom: 0.5rem;
        color: #ffffff;
    }

    :global(button) {
        background-color: #1e1e1e;
        border: 1px solid #2c2c2c;
        border-right: 6px solid #4dabf7;
        border-radius: 0.75rem;
        padding: 1rem;
        margin: 1rem 0;
        transition:
            background-color 0.3s ease,
            transform 0.2s ease;
    }

    :global(button:hover) {
        background-color: #292929;
        transform: translateY(-2px);
    }

    :global(p) {
        margin: 0.5rem 0 0;
        color: #b0b0b0;
        font-size: 0.95rem;
    }

    .playerid {
        color: gray;
        border-bottom: 1px solid #444;
    }
</style>
