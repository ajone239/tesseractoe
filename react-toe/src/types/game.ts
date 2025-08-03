export type OptionU8 = number | null;

export type Game = {
    id: string,
    player1_id: string,
    player2_id: string | null,
    game_state: string,
    player_moves: OptionU8[],
}

export type CreateGame = {
    player1_id: string,
}

export type AcceptGame = {
    player2_id: string,
}

export type PlayGame = {
    player_id: string,
    player_move: number,
}

export type GameResponse = {
    success: boolean,
    error: string | null
}

