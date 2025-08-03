'use client'
import { useParams } from "next/navigation";

export default function Play() {
    const { id } = useParams<{ id: string }>();

    return (
        <p>
            hello play @ {id}
        </p>
    );
}

