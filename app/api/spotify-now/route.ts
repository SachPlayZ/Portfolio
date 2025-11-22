import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = process.env;

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
  refreshToken: SPOTIFY_REFRESH_TOKEN,
});

async function refreshAccessToken() {
  const missingCreds =
    !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN;

  if (missingCreds) {
    throw new Error("Missing Spotify credentials");
  }

  const data = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(data.body["access_token"]);
}

export const revalidate = 0;

export async function GET() {
  try {
    await refreshAccessToken();

    const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();

    if (currentlyPlaying.body && currentlyPlaying.body.item) {
      const track = currentlyPlaying.body.item;
      if ("artists" in track) {
        return NextResponse.json({
          isPlaying: currentlyPlaying.body.is_playing,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url ?? "",
          songUrl: track.external_urls.spotify,
        });
      }
    }

    const lastPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });

    if (lastPlayed.body.items.length > 0) {
      const track = lastPlayed.body.items[0].track;
      if ("artists" in track) {
        return NextResponse.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url ?? "",
          songUrl: track.external_urls.spotify,
        });
      }
    }

    return NextResponse.json({
      isPlaying: false,
      title: "Not Playing",
      artist: "No recent tracks",
      album: "",
      albumArt: "",
      songUrl: "",
    });
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return NextResponse.json(
      {
        isPlaying: false,
        title: "Not Available",
        artist: "Error fetching data",
        album: "",
        albumArt: "",
        songUrl: "",
      },
      { status: 500 }
    );
  }
}

