<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Cell from '../Cell.svelte';
    import type { Game } from '$lib/game.ts';

    const size = 4;

    const data = $props();

    let { game_id } = data.data;

    let player_id: string | null;
    let interval: number;

    let game: Game | null = $state(null);

    let player_moves = $derived.by(() => {
        if (game) {
            return game.player_moves;
        } else {
            return Array(16).fill(null);
        }
    });

    /*
     * TODO(austin.jones):
     *
     * - disable ui if not your turn
     * - signify turn in ui
     */

    const status_game = async () => {
        if (game_id == undefined) {
            return;
        }

        const url = `http://localhost:3000/games/${game_id}/status`;

        const res = await fetch(url);
        game = await res.json();
    };

    onMount(() => {
        player_id = localStorage.getItem('playerId');
        interval = setInterval(status_game, 500); // poll every 5 sec
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    const onclick = async (id: number) => {
        const request = {
            player_id: player_id,
            player_move: id
        };

        const url = `http://localhost:3000/games/${game_id}/play`;

        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (res.status != 202) {
            const err_text = await res.text();
            alert(err_text);
        }

        status_game();
    };
</script>

<h2>Playing: {game_id}</h2>

{#if game}
    <p>Game has status {game.game_state}</p>

    <div class="opponent name"></div>

    <div class="game-board">
        {#each { length: size }, row (row)}
            <div class="game-row">
                {#each { length: size }, col (col)}
                    <Cell
                        id={row * size + col}
                        game_state={player_moves}
                        onclick={() => onclick(row * size + col)}
                    />
                {/each}
            </div>
        {/each}
    </div>

    <div class="own name"></div>
{:else}
    <p>Couldn't find game :(</p>
{/if}

<style>
    .game-row {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
    }
    .game-board {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
        align-items: center; /* center rows horizontally */
        justify-content: center; /* center vertically */
    }
</style>
