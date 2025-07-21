import { Injectable } from '@angular/core';
import { Game } from '../models/game';

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
    const request_url = `${this.base_url}/${game_id}`;

    const response = await fetch(request_url);

    const game = await response.json();

    return game ?? {};
  }
}
