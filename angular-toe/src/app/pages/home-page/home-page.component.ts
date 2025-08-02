import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { GamesService } from '../../services/games.service';
import { Game } from '../../models/game';
import { WaitingGameCardComponent } from '../../component/waiting-game-card/waiting-game-card.component';
import { GameCardComponent } from '../../component/game-card/game-card.component';


@Component({
  selector: 'app-home-page',
  imports: [RouterModule, WaitingGameCardComponent, GameCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  gameService = inject(GamesService);
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
    return () => {
      alert(game.id)
    }
  }

  createGame() {
    alert("Created")
  }

  private processGames(games: Game[]) {
    this.games = games

    this.waiting_games = games.filter(g => !g.player2_id);
    this.active_games = games.filter(g => g.player2_id);
  }

}
