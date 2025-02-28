import { exec } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const { videoId } = await req.json();
        if (!videoId) {
            return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
        }

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Run yt-dlp asynchronously and wait for the result
        const { stdout } = await execPromise(`yt-dlp -f bestaudio --get-url ${videoUrl}`);

        return NextResponse.json({ audioUrl: stdout.trim() });
    } catch (error) {
        console.error("Error fetching audio:", error);
        return NextResponse.json({ error: "Failed to fetch audio", details: error }, { status: 500 });
    }
}
