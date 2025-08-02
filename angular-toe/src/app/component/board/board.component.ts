import { Component, input, output } from '@angular/core';
import { Game } from '../../models/game';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-board',
  imports: [CellComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  counts = [...Array(4).keys()];

  game = input.required<Game>();
  cellClicked = output<number>();

  handleClick(id: number) {
    this.cellClicked.emit(id);
  }
}
