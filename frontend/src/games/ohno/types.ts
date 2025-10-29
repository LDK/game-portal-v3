import type { Game, GamePlayer } from "../../types/game";

export interface OhnoPlayer extends GamePlayer {
    cards: string[];
    user_profile_id?: number;
}

export interface OhnoGame extends Game {
    reverse?: boolean;
}