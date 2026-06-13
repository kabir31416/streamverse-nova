import { useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

type Props = {
  src: string;
  alternates?: string[];
  poster?: string;
  onNext?: () => void;
};

export function VideoPlayer({ src, alternates = [], poster, onNext }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<unknown>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    const sources = [src, ...alternates];
    const url = sources[attempt % sources.length];
    if (!url) return;

    setStatus("loading");
    setErrorMsg("");

    let cancelled = false;
    let hls: { destroy: () => void } | null = null;

    const isHls = /\.m3u8(\?|$)/i.test(url);
    const canNativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";

    const tryNext = (msg: string) => {
      if (cancelled) return;
      console.warn("Stream failed:", msg, url);
      if (attempt < sources.length - 1) {
        setAttempt((a) => a + 1);
      } else {
        setStatus("error");
        setErrorMsg(msg);
      }
    };

    const onPlaying = () => !cancelled && setStatus("playing");
    const onWaiting = () => !cancelled && setStatus("loading");
    const onError = () => tryNext("Playback failed");

    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onError);

    (async () => {
      try {
        if (isHls && !canNativeHls) {
          const mod = await import("hls.js");
          const Hls = mod.default;
          if (cancelled) return;
          if (Hls.isSupported()) {
            hls = new Hls({ enableWorker: true, lowLatencyMode: true, maxBufferLength: 30 });
            hlsRef.current = hls;
            // @ts-expect-error hls types
            hls.loadSource(url);
            // @ts-expect-error hls types
            hls.attachMedia(video);
            // @ts-expect-error hls types
            hls.on(Hls.Events.ERROR, (_e, data) => {
              if (data?.fatal) tryNext(data?.details || "HLS fatal error");
            });
          } else {
            tryNext("HLS not supported in this browser");
            return;
          }
        } else {
          video.src = url;
        }
        await video.play().catch(() => {
          // Autoplay may be blocked; user can press play.
          if (!cancelled) setStatus("playing");
        });
      } catch (e) {
        tryNext((e as Error).message);
      }
    })();

    return () => {
      cancelled = true;
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onError);
      if (hls) {
        try {
          hls.destroy();
        } catch {
          // ignore
        }
      }
      video.removeAttribute("src");
      video.load();
    };
  }, [src, attempt, alternates]);

  // Reset attempt when src changes
  useEffect(() => {
    setAttempt(0);
  }, [src]);

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        autoPlay
        muted
        className="h-full w-full object-contain"
      />
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center bg-black/80 p-6 text-center">
          <div>
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
            <p className="mt-3 font-semibold">Stream unavailable</p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">{errorMsg}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setAttempt(0)}
                className="rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-background"
              >
                Retry
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="rounded-full glass px-4 py-2 text-sm font-semibold"
                >
                  Try Next Channel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
