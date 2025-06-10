<script lang="ts">
    const { id, onclick, game_state }: { id: number; onclick: () => void; game_state: number[] } = $props();

    let cell_text = $derived.by(() => {
        let idx = game_state.indexOf(id);

        if (idx == -1) {
            return ' ';
        }

        return idx & 1 ? 'X' : 'O';
    });
</script>

<button {onclick}>
    <span class="main-text">{cell_text}</span>
    <span class="corner-text">{id}</span>
</button>

<style>
    button {
        position: relative;
        width: 6em;
        height: 6em;
        text-align: center;
        vertical-align: middle;
        border-radius: 0.5em;
        margin: 0 0 1em 0;
    }
    .main-text {
        position: relative;
        z-index: 1; /* Ensures it's on top of the button background */
        text-align: center;
        width: 5em;
        font-family: monospace;
        font-size: 3em;
    }

    .corner-text {
        position: absolute;
        top: 0.5em;
        left: 0.5em;
        text-align: left;
        opacity: 0.25;
        pointer-events: none; /* Ensures it doesn't interfere with clicks */
        z-index: 2;
    }
</style>
