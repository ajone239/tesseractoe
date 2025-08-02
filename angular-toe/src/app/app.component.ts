import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerInfo } from './services/player-info.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
  <main>
      <header class="brand-name">
        <a [routerLink]="['/']">
          <h1> Tesseractoe </h1>
        </a>
        <h4> Playing as {{ playerId }} </h4>
      </header>

    <section>
      <router-outlet></router-outlet>
    </section>
  </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  playerIdService = inject(PlayerInfo)

  playerId: string = this.playerIdService.getPlayerId();
  title = 'angular-toe';
}
