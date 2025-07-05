using System.Text.Json.Serialization;

namespace BlazorToe.Models;

/*
 * #[derive(Default, Deserialize, Clone, Copy)]
 * struct AcceptGame {
 *     player2_id: Uuid,
 * }
 * 
 */

public class AcceptGame
{
    [JsonPropertyName("player2_id")]
    public Guid Player2Id { get; set; }
}