import Square from "./Square";

type Props = {
    board_text: string[];
    onClick: (id: number) => void,
};

export default function Board({ board_text, onClick }: Props) {
    let board = []

    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            const id = i * 4 + j
            row.push((
                <Square text={board_text[id]} id={id} onClick={onClick} key={id} />
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

