import requests
import uuid

BASE_URL = "http://127.0.0.1:3000"

def create_game():
    player1_id = str(uuid.uuid4())  # Generate a random player ID
    response = requests.post(f"{BASE_URL}/games", json={"player1_id": player1_id})
    if response.status_code == 201:
        game = response.json()
        print(f"Game created: {game['id']}")
        return game['id'], player1_id
    else:
        print(f"Error creating game: {response.text}")
        return None, None

def accept_game(game_id, player2_id):
    response = requests.post(f"{BASE_URL}/games/{game_id}/accept", json={"player2_id": player2_id})
    if response.status_code == 202:
        print(f"Game {game_id} accepted by player {player2_id}")
    else:
        print(f"Error accepting game: {response.text}")

def get_game_status(game_id):
    response = requests.get(f"{BASE_URL}/games/{game_id}/status")
    if response.status_code in [201, 202]:
        game_status = response.json()
        print(f"Game status: {game_status}")
    else:
        print(f"Error fetching game status: {response.text}")

def play_game(game_id, player_id, player_move):
    response = requests.patch(f"{BASE_URL}/games/{game_id}/play", json={"player_id": player_id, "player_move": player_move})
    if response.status_code == 202:
        print(f"Player {player_id} played move {player_move} in game {game_id}")
    else:
        print(f"Error playing move: {response.text}")

if __name__ == "__main__":
    game_id, player1_id = create_game()
    if game_id:
        player2_id = str(uuid.uuid4())  # Generate a random second player ID
        accept_game(game_id, player2_id)
        get_game_status(game_id)

        play_game(game_id, player1_id, 0)  # Example move
        play_game(game_id, player1_id, 1)  # Double Move
        play_game(game_id, player2_id, 0)  # Redo Move

        play_game(game_id, player2_id, 4)
        play_game(game_id, player1_id, 1)

        play_game(game_id, player2_id, 5)
        play_game(game_id, player1_id, 2)

        play_game(game_id, player2_id, 6)
        play_game(game_id, player1_id, 3)

        play_game(game_id, player2_id, 7) # Shouldnt work

        get_game_status(game_id)
