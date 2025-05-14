import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

// Make sure this exactly matches what's in your Spotify Dashboard
const redirectUri = "https://sachplayz.vercel.app/api/spotify/callback";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: redirectUri,
});

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
];

export async function GET() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Missing Spotify credentials" },
      { status: 500 }
    );
  }

  const state = Math.random().toString(36).substring(7);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  return NextResponse.redirect(authorizeURL);
}
