import { Game } from "@/types/game"

type Props = {
    game: Game;
};

export default function GameCard({ game }: Props) {
    return (
        <div className="rounded-sm bg-amber-900 mt-5 p-3 hover:bg-amber-800 border-white hover:border-2">
            <h2 className="text-xl underline">
                Game Id: {game.id}
            </h2>
            <p>
                <em> Game State: {game.game_state} </em>
            </p>
            <p>
                <b>Player 1</b>: {game.player1_id}
            </p>
            <p>
                <b>Player 2</b>: {game.player2_id}
            </p>
            <p className="opacity-30">
                <em>Moves</em>: {game.player_moves.filter(i => i).map(i => ` ${i}`)}
            </p>
        </div>
    );
}

