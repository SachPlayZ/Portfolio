import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

async function refreshAccessToken() {
  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body["access_token"]);
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}

export async function GET() {
  try {
    await refreshAccessToken();

    // Try to get currently playing
    const currentlyPlaying = await spotifyApi.getMyCurrentPlayingTrack();

    if (currentlyPlaying.body && currentlyPlaying.body.item) {
      const track = currentlyPlaying.body.item;
      if ("artists" in track) {
        return NextResponse.json({
          isPlaying: currentlyPlaying.body.is_playing,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
        });
      }
    }

    // If no currently playing track, get last played
    const lastPlayed = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });

    if (lastPlayed.body.items.length > 0) {
      const track = lastPlayed.body.items[0].track;
      if ("artists" in track) {
        return NextResponse.json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
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
