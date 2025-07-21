import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Game } from '../../models/game';
import { WaitingGameCardComponent } from '../../component/waiting-game-card/waiting-game-card.component';


@Component({
  selector: 'app-home-page',
  imports: [RouterModule, WaitingGameCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  gameService = inject(GamesService);
  games: Game[] = [];
  waiting_games: Game[] = [];
  active_games: Game[] = [];

  constructor() {
    this.gameService.getAllGames()
      .then(data => {
        this.games = data

        this.waiting_games = data.filter(g => !g.player2_id);
        this.active_games = data.filter(g => g.player2_id);
      });
  }

  makeAcceptGame(game: Game) {
    return () => {
      alert(game.id)
    }
  }
}
