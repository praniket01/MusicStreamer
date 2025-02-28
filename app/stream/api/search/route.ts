import { exec } from "child_process";
import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10"

export async function POST(req: NextRequest) {

    try {
        const { query } = await req.json();
       
        if (!query) {
            return NextResponse.json({ error: "No query provided" }, { status: 400 });
        }
            const url = `${YOUTUBE_SEARCH_URL}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
            const res = await fetch(url);

            const data = await res.json();

            return NextResponse.json(data);


    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

