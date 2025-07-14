import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-waiting-page',
  imports: [],
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.scss'
})
export class WaitingPageComponent {
  route: ActivatedRoute = inject(ActivatedRoute);

  game_id = -1;

  constructor() {
    this.game_id = Number(this.route.snapshot.params['id']);
  }
}
