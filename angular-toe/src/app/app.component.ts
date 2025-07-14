import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
  <main>
    <a [routerLink]="['/']">
      <header class="brand-name">
        <h1>
          Tesseractoe
        </h1>
      </header>
    </a>

    <section>
      <router-outlet></router-outlet>
    </section>
  </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-toe';
}
