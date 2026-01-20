import { useEffect } from "react";
import type { GameLog } from "../types/game";
import type { OhnoGame } from "../games/ohno/types";

type GameSocketMessage = {
  game: OhnoGame;
  log: GameLog[];
};

export function useGameSocket(gameId: string, playerId: string, onMessage: (msg: GameSocketMessage) => void) {
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host;
    const socket = playerId ? 
      new WebSocket(`${protocol}://${host}/ws/game/${gameId}/player/${playerId}/`) :
      new WebSocket(`${protocol}://${host}/ws/game/${gameId}/`);
    socket.onopen = () => {
      console.log("WS connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error("Bad WS payload", e);
      }
    };

    socket.onclose = () => {
      console.log("WS disconnected");
    };

    return () => {
      socket.close();
    };
  }, [gameId, onMessage, playerId]);
}
