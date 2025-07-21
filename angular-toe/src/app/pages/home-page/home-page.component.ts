import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Game } from '../../models/game';


@Component({
  selector: 'app-home-page',
  imports: [RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  gameService = inject(GamesService);
  games: Game[] = [];

  constructor() {
    this.gameService.getAllGames()
      .then(data => {
        this.games = data
      });
  }
}
