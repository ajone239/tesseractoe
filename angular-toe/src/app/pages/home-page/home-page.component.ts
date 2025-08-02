import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { GamesService } from '../../services/games.service';
import { Game } from '../../models/game';
import { WaitingGameCardComponent } from '../../component/waiting-game-card/waiting-game-card.component';
import { GameCardComponent } from '../../component/game-card/game-card.component';
import { PlayerInfo } from '../../services/player-info.service';


@Component({
  selector: 'app-home-page',
  imports: [RouterModule, WaitingGameCardComponent, GameCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private playerIdService = inject(PlayerInfo);
  private gameService = inject(GamesService);
  private router = inject(Router);

  playerId: string = this.playerIdService.getPlayerId();
  games: Game[] = [];
  waiting_games: Game[] = [];
  active_games: Game[] = [];

  private sub = new Subscription();

  constructor() {
    this.gameService.getAllGames()
      .then(data => {
        this.processGames(data);
      });
  }

  ngOnInit() {
    this.sub.add(
      this.gameService.pollAllGames().subscribe(
        games => {
          console.log("got games");
          this.processGames(games);
        })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  makeAcceptGame(game: Game) {
    return async () => {
      const { success, error } = await this.gameService.acceptGame(game.id, this.playerId);

      if (!success) {
        alert(error ?? "Failed to accept")
      }

      this.router.navigate(['/play', game.id]);
    }
  }

  async createGame() {
    const new_game = await this.gameService.createGame(this.playerId);

    if (!new_game) {
      alert("creation failed")
      return;
    }

    const new_id = new_game.id;

    this.router.navigate(['/waiting', new_id]);
  }

  private processGames(games: Game[]) {
    this.games = games

    this.waiting_games = games.filter(g => !g.player2_id);
    this.active_games = games.filter(g => g.player2_id);
  }

}
