import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Subscription } from 'rxjs';
import { Game } from '../../models/game';
import { PlayerInfo } from '../../services/player-info.service';
import { BoardComponent } from '../../component/board/board.component';

@Component({
  selector: 'app-play-page',
  imports: [BoardComponent],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent {
  private playerIdService = inject(PlayerInfo);
  private gameService = inject(GamesService);
  private sub = new Subscription();

  route: ActivatedRoute = inject(ActivatedRoute);

  playerId: string = this.playerIdService.getPlayerId();
  game_id: string;
  game: Game | undefined;
  seconds_waited: number = 0;

  constructor() {
    this.game_id = this.route.snapshot.params['id'];
    this.gameService.getGame(this.game_id)
      .then(game => {
        this.game = game
      });
  }

  ngOnInit() {
    this.sub.add(
      this.gameService
        .pollGame(this.game_id)
        .subscribe(this.process_game)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  private process_game = (game: Game | undefined) => {
    if (!game) return;

    // Clone the player_moves array to force change detection
    const clonedGame: Game = {
      ...game,
      player_moves: [...game.player_moves]
    };

    this.game = clonedGame;
  }


  async onCellClick(id: number) {
    const { success, error } = await this.gameService.playGame(
      this.game_id,
      this.playerId,
      id,
    );

    if (!success) {
      alert(error);
    }

    const game = await this.gameService.getGame(this.game_id)

    this.game = game;
  }
}
