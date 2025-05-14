"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IconBrandSpotify,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";

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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 relative group">
      {data.albumArt ? (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden mb-4">
          <Image
            src={data.albumArt}
            alt={data.album}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {data.isPlaying ? (
              <IconPlayerPause className="w-10 h-10 text-white" />
            ) : (
              <IconPlayerPlay className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
      ) : (
        <div className="w-32 h-32 rounded-lg bg-black/40 flex items-center justify-center mb-4">
          <IconBrandSpotify className="w-12 h-12 text-green-500" />
        </div>
      )}

      <div className="text-center">
        <a
          href={data.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-purple-400 transition-colors"
        >
          <h4 className="font-medium text-sm mb-1 truncate max-w-[200px]">
            {data.title}
          </h4>
        </a>
        <p className="text-xs text-gray-400 truncate max-w-[200px]">
          {data.artist}
        </p>
      </div>

      <div className="absolute bottom-2 right-2">
        <IconBrandSpotify className="w-5 h-5 text-green-500" />
      </div>
    </div>
  );
}
