import { useEffect, useRef } from "react";

export function usePresenceSocket() {
  const wsRef = useRef<WebSocket | null>(null);

  const currentUrl = () =>
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}://${host}/ws/presence/`);
    wsRef.current = ws;

    // Heartbeat every 15s
    const heartbeat = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "heartbeat",
            url: currentUrl(),
          })
        );
      }
    }, 15000);

    // Activity pings (debounced)
    let activityTimer: number | null = null;
    const markActive = () => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;

      if (activityTimer) window.clearTimeout(activityTimer);
      activityTimer = window.setTimeout(() => {
        wsRef.current?.send(
          JSON.stringify({
            type: "active",
            url: currentUrl(),
          })
        );
      }, 400);
    };

    window.addEventListener("mousemove", markActive, { passive: true });
    window.addEventListener("keydown", markActive);

    // Optional: ping on navigation (browser back/forward)
    const onPopState = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "heartbeat",
            url: currentUrl(),
          })
        );
      }
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("popstate", onPopState);
      ws.close();
      wsRef.current = null;
    };
  }, []);
}
