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

    useEffect(() => {
        let isMounted = true;
        let timeoutId: ReturnType<typeof setTimeout>;


        const pollGame = async () => {
            if (!isMounted) return;

            let game = await GamesService.getGame(id);

            if (!game) {
                alert("Failed to grab game");
                return
            }

            setGame(game);

            timeoutId = setTimeout(pollGame, pollingTimeout);
        };

        pollGame();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId)
        }
    }, []);

    const handleClick = (id: number) => {
        alert(id)
    }

    const board_text = [
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
        'O',
        'X',
    ]

    return (
        <>
            <h1> Playing Game: {id} </h1>
            <Board board_text={board_text} onClick={handleClick} />
        </>

    );
}

