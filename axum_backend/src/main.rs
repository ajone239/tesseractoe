use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use axum::{
    Json, Router,
    extract::{Path, State},
    http::{Method, StatusCode},
    response::{Html, IntoResponse},
    routing::{get, patch, post},
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

use axum_backend::game::{Game, GameState};

#[tokio::main]
async fn main() {
    let db = Db::default();

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_headers([axum::http::header::CONTENT_TYPE])
        .allow_origin(Any);

    // build our application with a route
    let app = Router::new()
        .route("/", get(handler))
        .route("/games", get(get_games).post(add_game))
        .route("/games/{id}/accept", post(accept_game))
        .route("/games/{id}/status", get(status_game))
        .route("/games/{id}/play", patch(play_game))
        .layer(cors)
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
struct GameEntity {
    id: Uuid,
    player1_id: Uuid,
    player2_id: Option<Uuid>,
    game_state: GameState,
    player_moves: [Option<u8>; 16],
}

async fn get_games(State(db): State<Db>) -> impl IntoResponse {
    let db = db.lock().unwrap();
    let games: Vec<_> = db.clone().into_values().collect();
    Json(games)
}

type Db = Arc<Mutex<HashMap<Uuid, GameEntity>>>;

#[derive(Default, Deserialize, Serialize, Clone, Copy)]
struct CreateGame {
    player1_id: Uuid,
}

async fn add_game(State(db): State<Db>, Json(input): Json<CreateGame>) -> impl IntoResponse {
    let mut db = db.lock().unwrap();

    if let Some(game) = db
        .values()
        .find(|g| g.player1_id == input.player1_id && g.player2_id.is_none())
    {
        return (StatusCode::CREATED, Json(game.clone()));
    }

    let game = GameEntity {
        id: Uuid::new_v4(),
        player1_id: input.player1_id,
        player2_id: None,
        game_state: GameState::Started,
        player_moves: [None; 16],
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

    let Some(game) = db.get_mut(&game_id) else {
        return StatusCode::NOT_FOUND;
    };

    if game.player1_id == input.player2_id {
        return StatusCode::FORBIDDEN;
    }

    game.game_state = GameState::Playing;
    game.player2_id = Some(input.player2_id);

    StatusCode::ACCEPTED
}

async fn status_game(Path(game_id): Path<Uuid>, State(db): State<Db>) -> impl IntoResponse {
    let db = db.lock().unwrap();

    let Some(game) = db.get(&game_id) else {
        return (StatusCode::NOT_FOUND, Json(None));
    };

    let status = match game.player2_id {
        Some(_) => StatusCode::ACCEPTED,
        None => StatusCode::CREATED,
    };

    (status, Json(Some(game.to_owned())))
}

#[derive(Default, Deserialize, Clone, Copy)]
struct PlayGame {
    player_id: Uuid,
    player_move: u8,
}

async fn play_game(
    Path(game_id): Path<Uuid>,
    State(db): State<Db>,
    Json(input): Json<PlayGame>,
) -> impl IntoResponse {
    let mut db = db.lock().unwrap();

    let Some(game_entity) = db.get_mut(&game_id) else {
        return (StatusCode::NOT_FOUND, format!("No game for id {}", game_id));
    };

    if game_entity.player2_id.is_none() {
        return (StatusCode::FORBIDDEN, "Game isn't accepted".to_owned());
    }

    if game_entity.game_state.is_terminal() {
        return (
            StatusCode::LOCKED,
            format!("Game ended with state {:?}", game_entity.game_state),
        );
    }

    let mut game = Game::new(&mut game_entity.player_moves);

    let Some(next_move_index) = game.get_next_index() else {
        return (StatusCode::FORBIDDEN, "No moves to be made!".to_owned());
    };

    // even indexes go with player one
    let one_or_two = next_move_index & 1 == 0;

    // Check for the right player
    if (one_or_two && input.player_id != game_entity.player1_id)
        || (!one_or_two && input.player_id != game_entity.player2_id.unwrap())
    {
        let player = if one_or_two {
            game_entity.player1_id
        } else {
            game_entity.player2_id.unwrap()
        };
        return (
            StatusCode::FORBIDDEN,
            format!("It is the turn of player {:?}", player),
        );
    }

    // Check if this move has been made
    if game.has_move_been_played(input.player_move) {
        return (
            StatusCode::FORBIDDEN,
            format!("Move {} has already been played", input.player_move),
        );
    }

    let play_result = game.play(input.player_move);

    game_entity.game_state = game.calc_win();

    match play_result {
        Ok(_) => (StatusCode::ACCEPTED, "Success".to_owned()),
        Err(err) => (StatusCode::BAD_REQUEST, format!("Fail with error: {err:?}")),
    }
}
