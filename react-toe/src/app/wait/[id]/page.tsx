'use client'

import { useParams } from "next/navigation";

export default function Wait() {
    const { id } = useParams<{ id: string }>();

    return (
        <p>
            hello wait @ {id}
        </p>
    );
}


