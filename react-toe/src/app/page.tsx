'use client'

import { AcceptGame, CreateGame, Game } from "@/types/game";
import { GamesService } from "@/lib/game_service";
import { useEffect, useState } from "react";
import GameCard from "@/components/GameCard";
import OpenGameCard from "@/components/OpenGameCard";
import { useRouter } from "next/navigation";

const pollingTimeout: number = 1000;

export default function Home() {
    const router = useRouter();
    const [playerId, setPlayerId] = useState<string>("blah blah blah");
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        setPlayerId(localStorage.getItem('playerId') ?? "bad id")
    }, [])

    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;


        const pollGames = async () => {
            if (!isMounted) return;

            let games = await GamesService.getAllGames();

            setGames(games);

            timeoutId = setTimeout(pollGames, pollingTimeout);
        };

        pollGames();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId)
        }
    }, []);

    const createGame = async () => {
        console.log(playerId)
        const request: CreateGame = {
            player1_id: playerId,
        }

        const game = await GamesService.createGame(request);

        if (!game) {
            alert("Failed to create game");
            return;
        }

        router.push("/wait/" + game.id);
    };

    const acceptGame = async (gameId: string) => {
        const request: AcceptGame = {
            player2_id: playerId
        };

        const res = await GamesService.acceptGame(gameId, request);

        if (!res.success) {
            alert(res.error)
            return;
        }

        router.push('/play/' + gameId);
    }

    const openGames = games
        .filter(g => !g.player2_id)
        .map(game => (
            <li key={game.id}>
                <OpenGameCard
                    acceptGame={() => acceptGame(game.id)}
                    game={game} />
            </li>
        ));

    const activeGames = games
        .filter(g => g.player2_id)
        .map(game => (
            <li key={game.id}>
                <GameCard game={game} />
            </li>
        ));

    return (
        <>
            <div>
                <button className="menu-button" onClick={() => createGame()}>
                    Create New Game
                </button>

                <h1 className="text-3xl m-5">
                    Open Games:
                </h1>

                {
                    openGames.length ?
                        <ul className="m-5">
                            {openGames}
                        </ul> :
                        <p className="m-5 opacity-50">
                            <em>
                                Sorry there are no Open games.
                            </em>
                        </p>
                }

            </div>

            <div>
                <h1 className="text-3xl m-5">
                    Closed Games:
                </h1>

                {
                    activeGames.length ?
                        <ul className="m-5">
                            {activeGames}
                        </ul> :
                        <p className="m-5 opacity-50">
                            <em>
                                Sorry there are no games.
                            </em>
                        </p>
                }
            </div>
        </>
    );
}
