'use client'

import GameCard from "@/components/GameCard";
import { GamesService } from "@/lib/game_service";
import { Game } from "@/types/game";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const pollingTimeout = 1000;

export default function Wait() {
    const router = useRouter();
    const { id: gameId } = useParams<{ id: string }>();

    const [game, setGame] = useState<Game | null>(null)

    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;


        const pollGame = async () => {
            if (!isMounted) return;

            let game = await GamesService.getGame(gameId);

            if (!game) {
                alert("Failed to grab game");
                return
            }

            setGame(game);

            if (game.game_state == 'Playing') {
                router.push("/play/" + game.id);
                return;
            }

            timeoutId = setTimeout(pollGame, pollingTimeout);
        };

        pollGame();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId)
        }
    }, []);

    return (
        <>
            <h1>
                Waiting for game: {gameId}
            </h1>
            {
                game ?
                    <GameCard game={game} /> :
                    <p> No game :/ </p>
            }

        </>
    );
}


