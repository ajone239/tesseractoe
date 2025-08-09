import { AcceptGame, CreateGame, Game, PlayGame, GameResponse } from "@/types/game";

export abstract class GamesService {

    static base_url = 'http://localhost:3000/games';

    static async getAllGames(): Promise<Game[]> {
        const response = await fetch(GamesService.base_url);

        const games = await response.json();

        return games ?? [];
    }

    static async getGame(game_id: string): Promise<Game | undefined> {
        const request_url = `${GamesService.base_url}/${game_id}/status`;

        const response = await fetch(request_url);

        const game = await response.json();

        return game ?? {};
    }

    static async createGame(request: CreateGame): Promise<Game | undefined> {
        const res = await fetch(`${GamesService.base_url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        const game = await res.json();

        return game;
    }

    static async acceptGame(game_id: string, request: AcceptGame): Promise<GameResponse> {

        const url = `${GamesService.base_url}/${game_id}/accept`;

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (res.status != 202) {
            const err_text = await res.text();
            return { success: false, error: 'Accept failed: ' + err_text };
        }

        return { success: true, error: null };
    }

    static async playGame(game_id: string, request: PlayGame): Promise<GameResponse> {

        const url = `${GamesService.base_url}/${game_id}/play`;


        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (res.status != 202) {
            const err_text = await res.text();
            return { success: false, error: err_text };
        }

        return { success: true, error: null }
    }
}

