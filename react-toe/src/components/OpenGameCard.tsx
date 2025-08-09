import { Game } from "@/types/game"

type Props = {
    game: Game;
    acceptGame: () => void;
};

export default function OpenGameCard({ game, acceptGame }: Props) {
    return (
        <div className="rounded-sm bg-yellow-800 mt-5 p-3 hover:bg-yellow-700">
            <h2 className="text-xl underline">
                Game Id: {game.id}
            </h2>
            <p>
                <em> Game State: {game.game_state} </em>
            </p>
            <p>
                <b>Player 1</b>: {game.player1_id}
            </p>
            <div className="flex justify-end items-end">
                <button className="menu-button" onClick={() => acceptGame()}>
                    Accept Game
                </button>
            </div>
        </div>
    );
}

