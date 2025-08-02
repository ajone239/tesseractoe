import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerInfo {
  playerId: string = 'No player id';

  constructor() {        // Check if there's already a UUID in localStorage
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = crypto.randomUUID();
      localStorage.setItem('playerId', playerId);
    }

    this.playerId = playerId;
    console.log('Player ID:', this.playerId);
  }

  getPlayerId(): string {
    return this.playerId;
  }
}

