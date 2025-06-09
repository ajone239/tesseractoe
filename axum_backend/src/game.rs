use serde::Serialize;

#[derive(Default, Serialize, Clone)]
pub enum GameState {
    #[default]
    Started,
    Playing,
    NaughtWin,
    CrossWin,
    Draw,
}

impl GameState {
    fn is_terminal(&self) -> bool {
        match self {
            Self::NaughtWin | Self::CrossWin | Self::Draw => true,
            _ => false,
        }
    }
}

pub struct Game<'a> {
    player_moves: &'a [Option<u8>; 16],
}

impl Game<'_> {
    fn calc_win(&self) -> GameState {
        GameState::default()
    }

    fn has_won(indexes: &[Option<u8>; 8]) -> bool {
        false
    }
}
