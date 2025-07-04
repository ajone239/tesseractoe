using System.Text.Json.Serialization;

namespace BlazorToe.Models;

/*
 * #[derive(Default, Deserialize, Serialize, Clone, Copy)]
 * struct CreateGame {
 *     player1_id: Uuid,
 * }
 */
   
public class CreateGame
{
    [JsonPropertyName("player1_id")]
    public Guid Player1Id { get; set; }
}