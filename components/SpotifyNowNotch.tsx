"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Clock, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { FastAverageColor } from "fast-average-color";
import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isMobile } from "react-device-detect";

extend([mixPlugin]);

type SpotifyNowPayload = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  songUrl: string;
};

const LEFT_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
];

const RIGHT_LINKS = [
  { label: "Experience", href: "/#experience" },
  { label: "Achievements", href: "/#achievements" },
  { label: "Contact", href: "/#contact" },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

const navStyles = isMobile
  ? "flex items-center justify-center w-24 px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition-all duration-300 hover:text-[#3ba58b] hover:bg-white/50 rounded-full whitespace-nowrap"
  : "flex items-center justify-center w-32 px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition-all duration-300 hover:text-[#3ba58b] hover:bg-white/50 rounded-full whitespace-nowrap";

const mobileNavStyles =
  "flex w-full items-center justify-center px-4 py-3 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-700 transition-all duration-300 hover:text-[#3ba58b] hover:bg-white/70 rounded-full";

// 1. NavLinkBar Component
const NavLinkBar = ({
  links,
  visible,
}: {
  links: typeof LEFT_LINKS;
  visible: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-white/40 backdrop-blur-md border border-white/20 p-1 shadow-lg transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
      )}
    >
      {links.map((link) => (
        <a key={link.label} href={link.href} className={navStyles}>
          {link.label}
        </a>
      ))}
    </div>
  );
};

const MobileNavLinks = () => (
  <div className="flex w-full max-w-sm flex-col gap-2 rounded-4xl border border-white/20 bg-white/70 p-4 text-center shadow-lg backdrop-blur-md">
    {ALL_LINKS.map((link) => (
      <a key={link.label} href={link.href} className={mobileNavStyles}>
        {link.label}
      </a>
    ))}
  </div>
);

// 2. SpotifyNotch Component (Center Piece)
const SpotifyNotch = ({
  isOpen,
  data,
  isLoading,
  error,
  statusLabel,
  onMouseEnter,
}: {
  isOpen: boolean;
  data: SpotifyNowPayload | null;
  isLoading: boolean;
  error: string | null;
  statusLabel: string;
  onMouseEnter: () => void;
}) => {
  const [colors, setColors] = useState<{
    bg: string;
    text: string;
    subtext: string;
    iconBg: string;
    iconColor: string;
  } | null>(null);

  useEffect(() => {
    if (data?.albumArt) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(data.albumArt)
        .then((color) => {
          const c = colord(color.hex);
          const isDark = c.isDark();
          setColors({
            bg: c.alpha(0.8).toRgbString(),
            text: isDark
              ? c.mix("#ffffff", 0.95).toHex()
              : c.mix("#000000", 0.9).toHex(),
            subtext: isDark
              ? c.mix("#ffffff", 0.75).toHex()
              : c.mix("#000000", 0.7).toHex(),
            iconBg: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
            iconColor: isDark
              ? c.mix("#ffffff", 0.9).toHex()
              : c.mix("#000000", 0.8).toHex(),
          });
        })
        .catch(() => setColors(null));
    } else {
      setColors(null);
    }
  }, [data?.albumArt]);

  return (
    <div
      style={
        colors
          ? { backgroundColor: colors.bg, borderColor: colors.subtext + "30" }
          : undefined
      }
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden shadow-lg transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        !colors && "bg-white/40 border-white/30",
        "backdrop-blur-md border",
        isOpen
          ? "w-[360px] h-[100px] rounded-[2.5rem] px-4 md:w-[400px] md:px-6"
          : "w-[100px] h-[28px] rounded-b-xl hover:bg-white/60 cursor-pointer rounded-t-none md:w-[120px]"
      )}
      onMouseEnter={onMouseEnter}
    >
      {/* Collapsed Handle (Arrow) */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100 delay-100"
        )}
      >
        <ChevronDown
          className="h-4 w-4"
          style={{ color: colors ? colors.subtext : undefined }}
        />
      </div>

      {/* Expanded Content (Spotify Player) */}
      <div
        className={cn(
          "flex w-full items-center gap-5 transition-all duration-500 delay-75",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none absolute"
        )}
      >
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-md">
          {data?.albumArt ? (
            <img
              src={data.albumArt}
              alt={data.title}
              className={cn(
                "h-full w-full object-cover",
                data.isPlaying && "animate-[spin_6s_linear_infinite]"
              )}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-white/20 animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden min-w-0 flex-1 gap-0.5">
          {isLoading ? (
            <div
              className="flex items-center gap-2 text-xs"
              style={{
                color: colors ? colors.subtext : "rgba(255,255,255,0.6)",
              }}
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : error ? (
            <div className="text-xs text-red-300 truncate">{error}</div>
          ) : (
            <>
              <span
                className="truncate text-sm font-bold leading-tight"
                style={{ color: colors ? colors.text : undefined }}
              >
                {data?.title}
              </span>
              <span
                className="truncate text-xs font-medium"
                style={{ color: colors ? colors.subtext : undefined }}
              >
                {data?.artist}
              </span>
              <span
                className="truncate text-[10px] font-medium uppercase tracking-wider mt-0.5"
                style={{
                  color: colors ? colors.subtext : undefined,
                  opacity: 0.8,
                }}
              >
                {data?.album}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center h-8 w-8 rounded-full border border-white/20 transition-transform hover:scale-110"
                style={
                  colors
                    ? {
                        backgroundColor: colors.iconBg,
                        color: colors.iconColor,
                      }
                    : { backgroundColor: "rgba(255,255,255,0.3)" }
                }
              >
                {data?.isPlaying ? (
                  <Play className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{statusLabel}</p>
            </TooltipContent>
          </Tooltip>

          {data?.songUrl && !isLoading && !error && (
            <a
              href={data.songUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-[#1db954] text-white transition-transform hover:scale-110 hover:bg-[#1ed760] shadow-sm"
              aria-label="Listen on Spotify"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SpotifyNowNotch() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<SpotifyNowPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = useCallback(async (background = false) => {
    if (background) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch("/api/spotify-now", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Spotify data");
      }

      const payload: SpotifyNowPayload = await response.json();
      setData(payload);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to reach Spotify right now.");
    } finally {
      if (background) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchNowPlaying(false);
    const interval = setInterval(() => fetchNowPlaying(true), 60_000);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  const statusLabel = useMemo(() => {
    if (!data) return "Loading...";
    return data.isPlaying ? "Now Playing" : "Last Played";
  }, [data]);

  return (
    <>
      {/* Backdrop Blur Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-slate-900/10 backdrop-blur-sm transition-opacity duration-500 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Main Navigation Assembly */}
      <div
        className="fixed inset-x-0 top-0 z-[100] flex items-start justify-center pt-4"
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex w-full flex-col items-center gap-4 px-4 md:w-auto md:flex-row md:items-start md:gap-8 md:px-0">
          {/* Left Nav Bar */}
          <div
            className={cn(
              "hidden transition-all duration-700 md:block",
              isOpen ? "translate-y-0" : "-translate-y-20"
            )}
          >
            <NavLinkBar links={LEFT_LINKS} visible={isOpen} />
          </div>

          {/* Center Notch */}
          <div
            className={cn(
              "relative z-50 flex w-full justify-center transition-all duration-700 md:block md:w-auto",
              isOpen ? "translate-y-0" : "-translate-y-4"
            )}
          >
            <SpotifyNotch
              isOpen={isOpen}
              data={data}
              isLoading={isLoading}
              error={error}
              statusLabel={statusLabel}
              onMouseEnter={() => setIsOpen(true)}
            />
          </div>

          {/* Mobile Nav Links */}
          <div
            className={cn(
              "w-full transition-all duration-700 md:hidden",
              isOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0 pointer-events-none"
            )}
          >
            <MobileNavLinks />
          </div>

          {/* Right Nav Bar */}
          <div
            className={cn(
              "hidden transition-all duration-700 md:block",
              isOpen ? "translate-y-0" : "-translate-y-20"
            )}
          >
            <NavLinkBar links={RIGHT_LINKS} visible={isOpen} />
          </div>
        </div>
      </div>
    </>
  );
}
