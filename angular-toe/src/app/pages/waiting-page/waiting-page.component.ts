import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../../services/games.service';
import { Subscription } from 'rxjs';
import { Game } from '../../models/game';

@Component({
  selector: 'app-waiting-page',
  imports: [],
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.scss'
})
export class WaitingPageComponent {
  private gameService = inject(GamesService);
  private router = inject(Router);
  private sub = new Subscription();

  route: ActivatedRoute = inject(ActivatedRoute);

  game_id: string;
  game_status: string = "No status";
  seconds_waited: number = 0;

  constructor() {
    this.game_id = this.route.snapshot.params['id'];
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

  seconds_to_dots(): string {
    return ".".repeat(this.seconds_waited % 4);
  }

  private process_game(game: Game | undefined) {
    console.log("processing");
    this.seconds_waited++;

    if (game == null) {
      return;
    }

    this.game_status = game.game_state;

    if (game.game_state == 'Playing') {
      this.router.navigate(['/play/', game.id]);
    }
  }
}
