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
