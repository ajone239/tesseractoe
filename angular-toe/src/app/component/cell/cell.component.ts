import { Component, input } from '@angular/core';
import { OptionU8 } from '../../models/game';

@Component({
  selector: 'app-cell',
  imports: [],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.scss'
})
export class CellComponent {
  id = input.required<number>();
  player_moves = input.required<OptionU8[]>();
  click = input.required<() => void>();


  cellText(): string {
    let idx = this.player_moves().indexOf(this.id());

    if (idx == -1) {
      return ' ';
    }

    return idx & 1 ? 'X' : 'O';

  }
}
