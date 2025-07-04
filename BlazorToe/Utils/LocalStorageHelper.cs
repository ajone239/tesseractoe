using Blazored.LocalStorage;

namespace BlazorToe.Utils;

public static class LocalStorageHelper
{
    public static async Task<Guid> GetPlayerId(this ILocalStorageService localStorage)
    {
        Guid testPrivateId = await localStorage.GetItemAsync<Guid>("playerId");
        Console.WriteLine(testPrivateId);

        if (testPrivateId != Guid.Empty)
        {
            return testPrivateId;
        }
        
        Console.WriteLine($"gotta make a new one {testPrivateId}");
        testPrivateId = Guid.NewGuid();
        await localStorage.SetItemAsync("playerId", testPrivateId);
        return testPrivateId;
    }
}