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
    is_human: boolean;
    name: string;
    play_order: number;
    game_id: string;
    score?: number;
    id: string;
}

export interface GameCard {
    face: string;
    group: string;
    value: string;
    name: string;
    short: string;
}

export interface Game {
    id: string;
    title: GameTitle;
    winners?: GamePlayer[];
    created_at: string;
    updated_at: string;
    started_at?: string;
    cancelled_at?: string;
    ended_at?: string;
    last_play: string;
    max_players: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: Record<string, any>;
    round: number;
    players: GamePlayer[];
    turn_player?: GamePlayer;
    turn_order: number;
    started?: boolean;
    starter: string;
    current_card?: GameCard;
    user_player_id?: string;
};

interface LogSpecifics {
    card?: GameCard;
    message?: string;
    color?: string;
}

export interface GameLog {
    action: string;
    timestamp: string;
    player?: string;
    turnOrder: number;
    specifics?: LogSpecifics;
    cpu_name?: string;
}