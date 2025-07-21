/*
 * #[derive(Default, Serialize, Clone)]
 * struct GameEntity {
 *     id: Uuid,
 *     player1_id: Uuid,
 *     player2_id: Option<Uuid>,
 *     game_state: GameState,
 *     player_moves: [Option<u8>; 16],
 * }
 */

type OptionU8 = number | null;

export type Game = {
  id: string,
  player1_id: string,
  player2_id: string | null,
  game_state: string,
  player_moves: OptionU8[],
}

