import { Injectable } from '@angular/core';
import { Game } from '../models/game';
import { timer, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  base_url = 'http://localhost:3000/games';

  constructor() { }

  async getAllGames(): Promise<Game[]> {
    const response = await fetch(this.base_url);

    const games = await response.json();

    return games ?? [];
  }

  async getGame(game_id: string): Promise<Game | undefined> {
    const request_url = `${this.base_url}/${game_id}/status`;

    const response = await fetch(request_url);

    const game = await response.json();

    return game ?? {};
  }

  async createGame(player_id: string): Promise<Game | undefined> {
    const request = {
      player1_id: player_id
    };

    const res = await fetch('http://localhost:3000/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    const game = await res.json();

    return game;
  }

  async acceptGame(game_id: string, player_id: string):
    Promise<{
      success: boolean,
      error: string | null
    }> {
    const request = {
      player2_id: player_id
    };

    const url = `http://localhost:3000/games/${game_id}/accept`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (res.status == 404) {
      return { success: false, error: 'Accept failed: bad id' };
    }

    return { success: true, error: null };
  }

  async playGame(game_id: string, player_id: string, player_move: number):
    Promise<{
      success: boolean,
      error: string | null
    }> {
    const request = {
      player_id,
      player_move,
    };

    const url = `http://localhost:3000/games/${game_id}/play`;

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

  pollAllGames() {
    return timer(0, 1000).pipe(
      switchMap(() => this.getAllGames())
    );
  }

  pollGame(game_id: string) {
    return timer(0, 1000).pipe(
      switchMap(() => this.getGame(game_id))
    );
  }
}
