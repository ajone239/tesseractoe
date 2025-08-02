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
