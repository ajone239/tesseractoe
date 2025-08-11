import { OptionU8 } from "@/types/game";
import Square from "./Square";

type Props = {
    player_moves: OptionU8[];
    onClick: (id: number) => void,
};

export default function Board({ player_moves, onClick }: Props) {
    let board = []

    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            const id = i * 4 + j

            const idx = player_moves.indexOf(id);

            const cell_text = (idx == -1) ? " " : (idx & 1) ? "X" : "O";

            row.push((
                <Square text={cell_text} id={id} onClick={onClick} key={id} />
            ));
        }
        board.push((
            <div className="board-row" key={i}>
                {row}
            </div>
        ));
    }

    return (
        <>
            {board}
        </>
    )
}

