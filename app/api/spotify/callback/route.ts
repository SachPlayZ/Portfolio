import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://192.168.0.111:3000/api/spotify/callback",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    console.log(access_token, refresh_token);

    // Return an HTML page displaying the refresh token
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Token</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 20px;
              background: #000;
              color: #fff;
            }
            pre {
              background: #111;
              padding: 15px;
              border-radius: 8px;
              overflow-x: auto;
            }
            .warning {
              color: #ff4444;
              margin-top: 20px;
            }
            .steps {
              margin-top: 20px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <h1>🎵 Success!</h1>
          <p>Here's your refresh token:</p>
          <pre>${refresh_token}</pre>
          
          <div class="steps">
            <p class="warning">⚠️ Save this token! You won't be able to see it again.</p>
            <p>Next steps:</p>
            <ol>
              <li>Create a .env.local file in your project root if it doesn't exist</li>
              <li>Add the following to your .env.local:</li>
              <pre>SPOTIFY_CLIENT_ID=${process.env.SPOTIFY_CLIENT_ID}
SPOTIFY_CLIENT_SECRET=${process.env.SPOTIFY_CLIENT_SECRET}
SPOTIFY_REFRESH_TOKEN=${refresh_token}</pre>
              <li>Restart your Next.js development server</li>
            </ol>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}
