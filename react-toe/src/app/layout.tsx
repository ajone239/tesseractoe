'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [playerId, setPlayerId] = useState<string>("blah blah blah");

    useEffect(() => {
        // Check if there's already a UUID in localStorage
        let playerId = localStorage.getItem('playerId');
        if (!playerId) {
            playerId = crypto.randomUUID();
            localStorage.setItem('playerId', playerId);
        }
        console.log('Player ID:', playerId);
        setPlayerId(playerId)
    }, [])


    return (
        <>
            <header className="m-5">
                <a href="/" className="">
                    <h1 className="underline text-5xl hover:text-blue-800">
                        Tesseractoe
                    </h1>
                </a>
                <p className="text-gray-600">
                    Playing as : {playerId}
                </p>
            </header>
            <html lang="en" className="m-5">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                </body>
            </html>
        </>
    );
}
