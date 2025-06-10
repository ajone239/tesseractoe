<script>
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	let playerId = $state('');
	let interval;

	let games = $state([]);
	let open_games = $derived(games.filter((g) => !g.player2_id));
	let active_games = $derived(games.filter((g) => g.player2_id));

	const get_games = async () => {
		const res = await fetch('http://localhost:3000/games');
		const data = await res.json();

		games = data;
	};

	const new_game = async () => {
		const request = {
			player1_id: playerId
		};

		const res = await fetch('http://localhost:3000/games', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request)
		});

		console.log("Austin");
		console.log(res);

		const game = await res.json();
		console.log(game);
		console.log(game.id);

		goto('/waiting/' + game.id);
	};

	onMount(() => {
		playerId = localStorage.getItem('playerId');
		get_games(); // initial fetch
		interval = setInterval(get_games, 500); // poll every 5 sec
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<button onclick={new_game}> Make New Game </button>

<h2>Open Games</h2>

{#each open_games as game (game.id)}
	<div class="game open">
		<h3 class="game open">Game: {game.id}</h3>
		<p>Opponent: {game.player1_id}</p>
		<button
			onclick={async () => {
				const request = {
					player2_id: playerId
				};

				const url = `http://localhost:3000/games/${game.id}/accept`;

				const res = await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(request)
				});

				if (res.status == 404) {
					alert('Accept failed: bad id');
                    return;
				}

                goto('/play/' + game.id);
			}}>Accept</button
		>
	</div>
{:else}
	<p>No items found.</p>
{/each}

<h2>Other Games</h2>

{#each active_games as game (game.id)}
	<div class="game">
		<h3 class="game">Game: {game.id}</h3>
		<p>{game.game_state}</p>
		<p>Player 1: {game.player1_id}</p>
		<p>Player 2: {game.player2_id}</p>
	</div>
{:else}
	<p>No items found.</p>
{/each}

<style>
	.game {
		background-color: #1e1e1e;
		border: 1px solid #2c2c2c;
		border-left: 6px solid #4dabf7; /* soft blue accent */
		border-radius: 0.75rem;
		padding: 1rem;
		margin: 1rem 0;
		transition:
			background-color 0.3s ease,
			transform 0.2s ease;
	}

	.game:hover {
		background-color: #292929;
	}

	h3.game {
		margin: 0;
		font-size: 1.25rem;
		color: #007a89;
	}

	h3.game.open,
	.open {
		border-left: 6px solid #abf7dd;
	}
</style>
