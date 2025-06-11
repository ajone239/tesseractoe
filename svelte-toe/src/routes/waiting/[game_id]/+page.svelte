<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import type { Game } from '$lib/game';

    const data = $props();

    let { game_id } = data.data;

    let player_id: string | null;
    let interval: NodeJS.Timeout;

    let game: Game | null = $state(null);

    const status_game = async () => {
        if (game_id == undefined) {
            return;
        }

        const url = `http://localhost:3000/games/${game_id}/status`;

        const res = await fetch(url);
        game = await res.json();

        if (game == null) {
            return;
        }

        if (game.game_state == 'Playing') {
            goto('/play/' + game.id);
        }
    };

    onMount(() => {
        player_id = localStorage.getItem('playerId');
        interval = setInterval(status_game, 500); // poll every 5 sec
    });

    onDestroy(() => {
        clearInterval(interval);
    });
</script>

<h2>Waiting for game {game_id}...</h2>

{#if game}
    <p>Game has status {game.game_state}</p>
{:else}
    <p>Couldn't find game :(</p>
{/if}
