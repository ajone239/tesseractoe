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
