"use client";

import { useEffect, useState } from "react";

export default function SpotifyArtist() {
  const [artist, setArtist] = useState("No artist");

  async function fetchSpotifyData() {
    try {
      const response = await fetch("/api/spotify");
      const data = await response.json();
      setArtist(data.artist);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
    }
  }

  useEffect(() => {
    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 30000);
    return () => clearInterval(interval);
  }, []);

  return <span className="truncate">{artist}</span>;
}
