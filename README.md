# Tesseractoe

This repo holds an implementation of a 4x4 tic-tac-toe.
The rules are much the same as 3x3 tic-tac-toe with the addition of squares of like glyphs win.

<!-- TODO(ajone239): Add pics -->

# Why does this exist?

I want to try out abunch of web frameworks -- namely frontends.
This repo will have at least one backend implementation and many frontends.
The point of all this is to get a feel for each one and report pain points and benefits.

The expected backends are:

- [Axum](https://github.com/tokio-rs/axum)

The expected frontends are:

- [Svelte](https://svelte.dev)
- [React](https://react.dev)
- [Blazor](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor)
- [Angular](https://angular.dev)
- A scrappy python script for testing.

**Note**: Naming creds to [@karnwine729](https://github.com/karnwine729).

# How'd it go?

## Axum

Rust is a delight.

## Svelte

I really enjoy the style and reactivity of the language.
It feels very natural to make a page.
File based routing is very nice.
App flow is nice.

The data passing from the rage `+page.js` to the `+page.svelte` was difficult.
I also felt the whole time that I was using it half wrong.
I had a feeling that it would have been way easier to use full stack svelte then to try to use it to hit a backend.
This could be noob problems though.

## Blazor

Blazor was exceedingly weird.
There were many pain points.

- The data flow is weird.

    The Blazor server communicates with the client via WebSocket to send UI updates and handle events.
    So, instead of the page logic you send running in the browser, it actually runs on the frontend server.
    This really turns one mental model on its head.

    Note, you can do stuff in the browser using the blazor webassembly mode.

- Rendering is weird.

    From the previous bullet: a user goes to a page, the server does all the data initialization and such, and the server serves this over a websocket to the user.
    This means that most of the user's interaction has to go back to the server.
    It will do some diffing.
    It then serves you back the new render.

- The reactivity in it is very wpf.

    The function `StateHasChanged` smells alot like the stuff surrounding `INotifyChanged`.

- `@rendermode InteractiveServer`

    I stubbed my toe on this 3-4 times.
    You have to tell blazor that a page is interactive.
    (You can set this globally I think.)
    If you don't do this, then your page will do _nothing_ with respect to the server.

- Calling browser functions is hard.

    Since the bulk of your code isn't in the browser, it's had to do stuff _in the browser_.

    To do a simple `alert()`:
    ```csharp
    @inject IJSRuntime Js

    //...

    await Js.InvokeVoidAsync("alert", "Could not accept!");
    ```

    To use browser storage:
    ```csharp
    public static async Task<Guid> GetPlayerId(this ILocalStorageService localStorage)
    {
        Guid testPrivateId = await localStorage.GetItemAsync<Guid>("playerId");
        Console.WriteLine(testPrivateId);

        if (testPrivateId != Guid.Empty)
        {
            return testPrivateId;
        }

        Console.WriteLine($"gotta make a new one {testPrivateId}");
        testPrivateId = Guid.NewGuid();
        await localStorage.SetItemAsync("playerId", testPrivateId);
        return testPrivateId;
    }
    ```

- `dotnet watch run` is very bad at properly resetting everything.

    I pass the board game state from the play page down to the cells.
    Debugging this reactivity took about 2 hours because of `dotnet watch run` not restarting property.
    Shutting the watch process down, building, and trying it again revealed there'd been no bug for 45 minutes.

- project structure leave alot to be desired

    Svelte has the `routes` directory for the site structure and `lib` for all the library stuff.
    Blazor gives you no such guidance.
    Maybe, this is a "feature".
    I'd rather a little more guidance on how it should go.

There was good stuff.

- The c# Http api was super ergonomic.

    Thiiiiiis
    ```Csharp
        async Task CreateNewGame()
    {
        Console.WriteLine($"trying to create a new game as {_privateId}");

        var request = new CreateGame
        {
            Player1Id = _privateId,
        };

        var result = await Http.PostAsJsonAsync(
            "http://localhost:3000/games",
            request
        );

        if (!result.IsSuccessStatusCode)
        {
            await Js.InvokeVoidAsync("alert", "Could not make game!");
            return;
        }

        var game = await result.Content.ReadFromJsonAsync<Game>();

        if (game is null)
        {
            await Js.InvokeVoidAsync("alert", "Could not make game!");
            return;
        }

        Navigation.NavigateTo($"/waiting/{game.Id}");
    }
    ```

    vs this

    ```ts
        const new_game = async () => {
        const request = {
            player1_id: playerId
        };

        const res = await fetch('http://localhost:3000/games', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        const game = await res.json();

        goto('/waiting/' + game.id);
    };
    ```

    `JSON.stringify()` feels awko.
    You get a json object not a nice, hard, rigid C# object.
    Don't get me started on `fetch`.

- Types! Types! Compliled Types!

    Please reference all the hardness and rigidity in the bullet above.

- bootstrap css was pretty cool

    This made the weird css file layout in Blazor not as bad :).

## Angular

### What I did like

- It felt super organized

- Services and injection encouraged me to keep my code well separated

- It felt like a pure frontend experience.

    I would make a page.
    It would send a request to the backend.
    It would do stuff with the data.
    The frontend server side didn't do much but serve me the page.

- Events, I like that they both keep logic separated and keep the calling of the function in a place that feels right.

### What I didn't like

- Events, I didn't like that they stepped away from what feels like a very Javascript-y pattern.

- The reactivity was implicit. I didn't like that. It seems like `signal()` and `computed()` make the model more svelte-y, but that isn't what the tutorial on the website teaches.

- All these frameworks have their own little mark up extensions on either html or ts/js. I personally found angular's to be the most annoying.

```angular
<h1>Playing game: {{ game_id }}!</h1>

<!-- @if, @for, @switch makes enough sense -->
@if (!game) {
<p>There were problems loading the game.</p>
} @else {

<!--
    [prop] is input and (prop) is output
    this makes enough sense once you grasp it
    but then the descrepency between "blah" and {{ blah }}
    it feels very inconsistent in a way that other frameworks haven't
-->
<app-board [game]="game" (cellClicked)="onCellClick($event)"></app-board>

<div>

  <p> Game has status {{ game.game_state }} </p>

  @if (game.player1_id == playerId) {
  <p> Opponent is {{ game.player2_id}} </p>
  } @else {
  <p> Opponent is {{ game.player1_id}} </p>
  }
</div>
}
```

- You have to use full tags the whole time. Something about the angular parser prevents on from using:

```angular
<app-board [game]="game" (cellClicked)="onCellClick($event)" />
```

so you must

```angular
<app-board [game]="game" (cellClicked)="onCellClick($event)"></app-board>
```

This feels particularly egregious when we have no arguments at all.
Is this quibbly?
Maybe.
Is a comparison of 4 modern enough frameworks bound to be quibbly?
Certainly.

- You are flying blind-ish

Full qualification: I used neovim + `angularls` to write all this code.
So, some light research points to something like JetBrains's WebStorm supporting this a little better.
That said, the editor experience is pretty bad.
Editing the ts is fine, because it's just ts.
Same for the css.
But when editing the html templates, it's rare that the editor/lsp helps you out all that much.
This is especially painful when you bring in the previous point that the markup feels a bit funky.

This often boils out to editing with an eye on `ng server`/`ng build` to make sure that types are checking out.

- It feels clunky to edit

    When you are devving for just one page get 2 options: have atleast 2 (but more often 3) files open, or  edit html/css in a string literal in a js file like a caveman.
    Of these two, I opted for the multiple files.
    I spent enough time with `.c` and `.h` files.
    Still, with things like svelte on the card that really elegantly blend mark up source and styping this really stuck out.
    Take the following example: you have a searchable page of apartment listings.

    + Have atleast 2 (but more often 3) files open

```angular
import { Component, inject } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housinglocation';
import { HousingService } from '../housing';

@Component({
    selector: 'app-home',
    imports: [HousingLocation],
    templateUrl: `home.html`,
    styleUrl: `home.scss`,
})
export class Home {
    housingLocationList: HousingLocationInfo[] = [];
    filteredLocationList: HousingLocationInfo[] = [];

    housingService: HousingService = inject(HousingService);

    constructor() {
        this.housingService
            .getAllHousingLocations()
            .then((locations) => {
                this.housingLocationList = locations;
                this.filteredLocationList = locations;
            });
    }

    filterResults(text: string) {
        if (!text) {
            this.filteredLocationList = this.housingLocationList;
            return;
        }
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
            housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
        );
    }
}
```

```scss
.results {
    display: grid;
    column-gap: 14px;
    row-gap: 14px;
    grid-template-columns: repeat(auto-fill, minmax(400px, 400px));
    margin-top: 50px;
    justify-content: space-around;
}
input[type="text"] {
    border: solid 1px var(--primary-color);
    padding: 10px;
    border-radius: 8px;
    margin-right: 4px;
    display: inline-block;
    width: 30%;
}
button {
    padding: 10px;
    border: solid 1px var(--primary-color);
    background: var(--primary-color);
    color: white;
    border-radius: 8px;
}
```

```html
  <section>
    <form>
      <input type="text" placeholder="Filter by city" #filter/>
      <button class="primary" type="button" (click)="filterResults(filter.value)">
          Search
      </button>
    </form>
  </section>
  <section class="results">
      @for(housingLocation of filteredLocationList; track $index) {
          <app-housing-location [housingLocation]="housingLocation"></app-housing-location>
      }
  </section>
```

    + edit html/css in a string literal in a js file like a caveman

```angular
import { Component, inject } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../housinglocation';
import { HousingService } from '../housing';

@Component({
    selector: 'app-home',
    imports: [HousingLocation],
    template: `
      <section>
        <form>
          <input type="text" placeholder="Filter by city" #filter/>
          <button class="primary" type="button" (click)="filterResults(filter.value)">
              Search
          </button>
        </form>
      </section>
      <section class="results">
          @for(housingLocation of filteredLocationList; track $index) {
              <app-housing-location [housingLocation]="housingLocation"></app-housing-location>
          }
      </section>
    `,
    styles: `
    .results {
        display: grid;
        column-gap: 14px;
        row-gap: 14px;
        grid-template-columns: repeat(auto-fill, minmax(400px, 400px));
        margin-top: 50px;
        justify-content: space-around;
    }
    input[type="text"] {
        border: solid 1px var(--primary-color);
        padding: 10px;
        border-radius: 8px;
        margin-right: 4px;
        display: inline-block;
        width: 30%;
    }
    button {
        padding: 10px;
        border: solid 1px var(--primary-color);
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
    }
    `,
})
export class Home {
    housingLocationList: HousingLocationInfo[] = [];
    filteredLocationList: HousingLocationInfo[] = [];

    housingService: HousingService = inject(HousingService);

    constructor() {
        this.housingService
            .getAllHousingLocations()
            .then((locations) => {
                this.housingLocationList = locations;
                this.filteredLocationList = locations;
            });
    }

    filterResults(text: string) {
        if (!text) {
            this.filteredLocationList = this.housingLocationList;
            return;
        }
        this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
            housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
        );
    }
}
```
