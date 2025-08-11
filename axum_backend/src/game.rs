use anyhow::{Result, bail};
use serde::Serialize;

#[derive(Debug, Default, Serialize, Clone)]
pub enum GameState {
    #[default]
    Started,
    Playing,
    NaughtWin,
    CrossWin,
    Draw,
}

impl GameState {
    pub fn is_terminal(&self) -> bool {
        matches!(self, Self::NaughtWin | Self::CrossWin | Self::Draw)
    }
}

pub struct Game<'a> {
    player_moves: &'a mut [Option<u8>; 16],
}

impl<'a> Game<'a> {
    pub fn new(player_moves: &'a mut [Option<u8>; 16]) -> Self {
        Self { player_moves }
    }

    pub fn get_next_index(&self) -> Option<usize> {
        self.player_moves.iter().position(|m| m.is_none())
    }

    pub fn play(&mut self, player_move: u8) -> Result<()> {
        let Some(next_index) = self.get_next_index() else {
            bail!("No next index");
        };

        if self.has_move_been_played(player_move) {
            bail!("Bad move");
        }

        self.player_moves[next_index] = Some(player_move);

        Ok(())
    }

    pub fn has_move_been_played(&self, player_move: u8) -> bool {
        self.player_moves
            .iter()
            .flatten()
            .any(|m| *m == player_move)
    }

    fn get_players_moves(&self, noughts_or_crosses: bool) -> Vec<u8> {
        self.player_moves
            .iter()
            .enumerate()
            .filter(|(i, _)| (i & 1 == 0) == noughts_or_crosses)
            .map(|(_, m)| *m)
            .flatten()
            .collect()
    }

    pub fn calc_win(&self) -> GameState {
        let naughts = self.get_players_moves(true);
        let crosses = self.get_players_moves(false);

        if Self::has_won(&naughts) {
            return GameState::NaughtWin;
        }

        if Self::has_won(&crosses) {
            return GameState::CrossWin;
        }

        let index_test = self.get_next_index();

        if index_test.is_none() {
            return GameState::Draw;
        }

        GameState::Playing
    }

    fn has_won(indexes: &[u8]) -> bool {
        let ways_to_win = [
            //horz
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
            [12, 13, 14, 15],
            // vert
            [0, 4, 8, 12],
            [1, 5, 9, 13],
            [2, 6, 10, 14],
            [3, 7, 11, 15],
            // diag
            [0, 5, 10, 15],
            [3, 6, 9, 12],
            // corners
            [0, 1, 4, 5],
            [2, 3, 6, 7],
            [8, 9, 12, 13],
            [10, 11, 14, 15],
            // middle edge
            [1, 2, 5, 6],
            [4, 5, 8, 9],
            [6, 7, 10, 11],
            [9, 10, 13, 14],
            // center
            [5, 6, 9, 10],
        ];

        ways_to_win
            .iter()
            .any(|way| way.iter().all(|widx| indexes.contains(widx)))
    }
}
