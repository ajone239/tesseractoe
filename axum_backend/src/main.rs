use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use axum::{
    Json, Router,
    extract::{Path, State},
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[tokio::main]
async fn main() {
    let db = Db::default();

    // build our application with a route
    let app = Router::new()
        .route("/", get(handler))
        .route("/games", get(get_games).post(add_games))
        .with_state(db);

    // run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}

#[derive(Default, Serialize, Clone)]
struct Game {
    id: Uuid,
    player1_id: Uuid,
    player2_id: Option<Uuid>,
    state: [u8; 16],
}

async fn get_games(State(db): State<Db>) -> impl IntoResponse {
    let db = db.lock().unwrap();
    let games: Vec<_> = db.clone().into_values().collect();
    Json(games)
}

type Db = Arc<Mutex<HashMap<Uuid, Game>>>;

#[derive(Default, Deserialize, Serialize, Clone, Copy)]
struct CreateGame {
    player1_id: Uuid,
}

async fn add_games(State(db): State<Db>, Json(input): Json<CreateGame>) -> impl IntoResponse {
    let mut db = db.lock().unwrap();

    if let Some(game) = db
        .values()
        .find(|g| g.player1_id == input.player1_id && g.player2_id.is_none())
    {
        return (StatusCode::CREATED, Json(game.clone()));
    }

    let game = Game {
        id: Uuid::new_v4(),
        player1_id: input.player1_id,
        player2_id: None,
        state: [0u8; 16],
    };

    db.insert(game.id, game.clone());

    (StatusCode::CREATED, Json(game))
}

#[derive(Default, Deserialize, Clone, Copy)]
struct AcceptGame {
    player2_id: Uuid,
}

async fn accept_game(
    Path(game_id): Path<Uuid>,
    State(db): State<Db>,
    Json(input): Json<AcceptGame>,
) -> impl IntoResponse {
    let mut db = db.lock().unwrap();

    (StatusCode::ACCEPTED)
}
