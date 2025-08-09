type Props = {
    text: string,
    id: number,
    onClick: (id: number) => void,
};

export default function Square({ text, id, onClick: onClick }: Props) {
    return (
        <>
            <button
                onClick={() => onClick(id)}
                className="relative bg-gray-700 w-[6em] h-[6em] text-center align-middle rounded-[0.5em] m-[0.25em] border-gray-300 border-1">
                <span className="main-text relative z-[1] text-center w-[5em] font-mono text-[3em]">
                    {text}
                </span>
                <span className="corner-text absolute top-[0.5em] left-[0.5em] text-left opacity-25 pointer-events-none z-[2]">
                    {id}
                </span>
            </button>
        </>

    );
}
