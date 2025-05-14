"use client";

import { useEffect, useState } from "react";

export default function SpotifyTitle() {
  const [title, setTitle] = useState("Not Playing");

  async function fetchSpotifyData() {
    try {
      const response = await fetch("/api/spotify");
      const data = await response.json();
      setTitle(data.title);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
    }
  }

  useEffect(() => {
    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 30000);
    return () => clearInterval(interval);
  }, []);

  return <span className="truncate">{title}</span>;
}
