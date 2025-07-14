import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-play-page',
  imports: [],
  templateUrl: './play-page.component.html',
  styleUrl: './play-page.component.scss'
})
export class PlayPageComponent {
  route: ActivatedRoute = inject(ActivatedRoute);

  game_id = -1;

  constructor() {
    this.game_id = Number(this.route.snapshot.params['id']);
  }
}
