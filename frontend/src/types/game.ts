import type { User } from "./user";

export interface GameTitle {
    id: string;
    name: string;
    slug: string;
    description: string;
    cover_image: string | null;
    category: string | null;
};

export interface GamePlayer {
    user?: User;
    cpu: boolean;
    name: string;
    order: number;
    game_id: string;
    score?: number;
}

export interface Game {
    id: string;
    title: GameTitle;
    winner?: GamePlayer;
    created_at: string;
    updated_at: string;
    started_at?: string;
    cancelled_at?: string;
    ended_at?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: Record<string, any>;
    round: number;
    players: GamePlayer[];
    turn_player?: GamePlayer;
};