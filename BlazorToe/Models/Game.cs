using System.Text.Json.Serialization;

namespace BlazorToe.Models;

/*
 * #[derive(Default, Serialize, Clone)]
 * struct GameEntity {
 *     id: Uuid,
 *     player1_id: Uuid,
 *     player2_id: Option<Uuid>,
 *     game_state: GameState,
 *     player_moves: [Option<u8>; 16],
 * }
 * 
 */

public class Game
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("player1_id")]
    public Guid Player1Id { get; set; }

    [JsonPropertyName("player2_id")]
    public Guid? Player2Id { get; set; }

    [JsonPropertyName("game_state")]
    public required string GameState { get; set; }

    [JsonPropertyName("player_moves")]
    public uint?[] PlayerMoves { get; set; } = [];
    
    public string PlayerMovesString =>  string.Join(",", PlayerMoves.Where(m => m is not null));
        
}