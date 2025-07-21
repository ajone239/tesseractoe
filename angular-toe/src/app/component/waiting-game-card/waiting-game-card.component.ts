import { Component, input } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-waiting-game-card',
  imports: [],
  templateUrl: './waiting-game-card.component.html',
  styleUrl: './waiting-game-card.component.scss'
})
export class WaitingGameCardComponent {
  game = input.required<Game>();
  acceptGame = input.required<() => void>();
}
