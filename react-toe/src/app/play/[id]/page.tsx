'use client'
import Board from "@/components/Board";
import { GamesService } from "@/lib/game_service";
import { Game } from "@/types/game";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const pollingTimeout = 1000;

export default function Play() {
    const { id } = useParams<{ id: string }>();

    const [game, setGame] = useState<Game | null>(null)
    const [playerId, setPlayerId] = useState<string>("blah blah blah");

    useEffect(() => {
        setPlayerId(localStorage.getItem('playerId') ?? "bad id")
    }, [])


    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;


        const pollGame = async () => {
            if (!isMounted) return;

            await statusGame();

            timeoutId = setTimeout(pollGame, pollingTimeout);
        };

        pollGame();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId)
        }
    }, []);

    const statusGame = async () => {
        let game = await GamesService.getGame(id);

        if (!game) {
            alert("Failed to grab game");
            return
        }

        setGame(game);
    }

    const handleClick = async (id: number) => {
        const request = {
            player_id: playerId,
            player_move: id
        };

        if (!game) {
            alert("No game to play :/");
            return;
        }

        const res = await GamesService.playGame(game.id, request);

        if (!res.success) {
            alert(res.error);
            return;
        }

        await statusGame()
    };

    return (
        <>
            <h1> Playing Game: {id} </h1>
            <p> Game State: {game?.game_state ?? "null"} </p>
            {
                game ?
                    <Board player_moves={game.player_moves} onClick={handleClick} /> :
                    <p> Sorry no game :( </p>
            }
        </>

    );
}

