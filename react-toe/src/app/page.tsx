import { Game } from "@/types/game";
import { useState } from "react";

export default function Home() {
    const [games, setGames] = useState<Game[]>([])

    const openGames = games.filter(g => !g.player2_id);
    const activeGames = games.filter(g => g.player2_id);

    return (
        <>
            <p>
                hello world
            </p>
            <a href="/play/test-id-0000">
                play
            </a>
            <a href="/wait/test-id-0001">
                wait
            </a>
        </>
    );
}
