<script>
	import { onMount, onDestroy } from 'svelte';

	const data = $props();

	console.log(data);

	let { game_id } = data;

	console.log(game_id);

	let player_id;
	let interval;

	let game = $state(undefined);

	const status_game = async () => {
		if (game_id == undefined) {
			return;
		}

		const url = `http://localhost:3000/games/${game_id}/accept`;

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
</script>

<h2>Waiting for game {game_id}...</h2>

{#if game}
	<p>Game has status {game.game_staus}</p>
{:else}
	<p>Couldn't find game :(</p>
{/if}
