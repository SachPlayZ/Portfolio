"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IconBrandSpotify } from "@tabler/icons-react";

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  songUrl: string;
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchSpotifyData() {
    try {
      const response = await fetch("/api/spotify");
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSpotifyData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchSpotifyData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <IconBrandSpotify className="w-8 h-8 text-green-500" />
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full h-full relative">
      {data.albumArt ? (
        <Image
          src={data.albumArt}
          alt={data.album}
          fill
          className="object-cover rounded-t-xl"
        />
      ) : (
        <div className="w-full h-full bg-black/40 flex items-center justify-center rounded-t-xl">
          <IconBrandSpotify className="w-12 h-12 text-green-500" />
        </div>
      )}
      <div className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full">
        <IconBrandSpotify className="w-4 h-4 text-green-500" />
      </div>
    </div>
  );
}
