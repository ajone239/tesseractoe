namespace BlazorToe.Services;

public class PlayerState
{
    public Guid PlayerId { get; set; } =  Guid.NewGuid();
}