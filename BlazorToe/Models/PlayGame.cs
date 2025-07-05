using System.Text.Json.Serialization;

namespace BlazorToe.Models;

/* #[derive(Default, Deserialize, Clone, Copy)]
 * struct PlayGame {
 *     player_id: Uuid,
 *     player_move: u8,
 * }
 */  

public class PlayGame
{
    [JsonPropertyName("player_id")]
    public Guid PlayerId { get; set; }
    
    [JsonPropertyName("player_move")]
    public uint PlayerMove { get; set; }
}